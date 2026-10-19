const conexion = require("../config/database");


async function obtenerMaquinas() {

    const [filas] = await conexion.query(`
        SELECT
            id_maquina,
            codigo,
            nombre,
            ubicacion,
            criticidad,
            estado
        FROM maquina
        ORDER BY codigo
    `);

    return filas;
}


async function obtenerHistorialMaquina(idMaquina) {

    const [maquinas] = await conexion.query(`
        SELECT
            id_maquina,
            codigo,
            nombre,
            ubicacion,
            criticidad,
            estado
        FROM maquina
        WHERE id_maquina = ?
    `, [idMaquina]);


    if (maquinas.length === 0) {
        return null;
    }


    const [intervenciones] = await conexion.query(`
        SELECT
            o.id_orden,
            o.numero_consecutivo,
            o.prioridad,
            o.estado AS estado_orden,
            o.fecha_cierre,

            s.id_solicitud,
            s.tipo_mantenimiento,
            s.descripcion_falla,
            s.fecha_hora AS fecha_solicitud,

            i.id_intervencion,
            i.diagnostico,
            i.fecha_hora AS fecha_intervencion,
            i.fecha_inicio,
            i.fecha_fin,
            i.tiempo_reparacion,
            i.estado_equipo,

            u.nombre AS nombre_tecnico

        FROM solicitud s

        INNER JOIN orden_de_trabajo o
            ON s.id_solicitud = o.id_solicitud

        LEFT JOIN intervencion i
            ON o.id_orden = i.id_orden

        LEFT JOIN usuario u
            ON o.id_tecnico = u.id_usuario

        WHERE s.id_maquina = ?

        ORDER BY
            s.fecha_hora DESC,
            o.id_orden DESC
    `, [idMaquina]);


    const [repuestos] = await conexion.query(`
        SELECT
            o.id_orden,
            o.numero_consecutivo,
            i.id_intervencion,

            r.id_repuesto,
            r.codigo,
            r.nombre,

            d.cantidad,
            d.costo_unitario,
            (d.cantidad * d.costo_unitario) AS costo_total

        FROM solicitud s

        INNER JOIN orden_de_trabajo o
            ON s.id_solicitud = o.id_solicitud

        INNER JOIN intervencion i
            ON o.id_orden = i.id_orden

        INNER JOIN detalle_de_repuesto d
            ON i.id_intervencion = d.id_intervencion

        INNER JOIN repuesto r
            ON d.id_repuesto = r.id_repuesto

        WHERE s.id_maquina = ?

        ORDER BY
            o.id_orden DESC,
            d.id_detalle DESC
    `, [idMaquina]);


    return {
        maquina: maquinas[0],
        intervenciones,
        repuestos
    };
}


module.exports = {
    obtenerMaquinas,
    obtenerHistorialMaquina
};