const conexion = require("../config/database");

async function obtenerOrdenesJefe() {

    const [filas] = await conexion.query(`
        SELECT
            o.id_orden,
            o.numero_consecutivo,
            o.prioridad,
            o.estado,
            s.id_solicitud,
            m.codigo AS codigo_maquina,
            m.nombre AS nombre_maquina,
            u.nombre AS nombre_tecnico
        FROM orden_de_trabajo o

        INNER JOIN solicitud s
            ON o.id_solicitud = s.id_solicitud

        INNER JOIN maquina m
            ON s.id_maquina = m.id_maquina

        LEFT JOIN usuario u
            ON o.id_tecnico = u.id_usuario

        ORDER BY o.id_orden DESC
    `);

    return filas;
}

async function obtenerOrdenesParaAsignar() {

    const [filas] = await conexion.query(`
        SELECT
            o.id_orden,
            o.numero_consecutivo,
            m.codigo AS codigo_maquina,
            m.nombre AS nombre_maquina
        FROM orden_de_trabajo o
        INNER JOIN solicitud s
            ON o.id_solicitud = s.id_solicitud
        INNER JOIN maquina m
            ON s.id_maquina = m.id_maquina
        WHERE o.estado = 'Pendiente'
        ORDER BY o.id_orden DESC
    `);

    return filas;
}

async function asignarTecnico(idOrden, idTecnico) {

    const [resultado] = await conexion.query(
        `UPDATE orden_de_trabajo
         SET id_tecnico = ?
         WHERE id_orden = ?
         AND estado IN ('Pendiente', 'En proceso')`,
        [
            idTecnico || null,
            idOrden
        ]
    );

    return resultado.affectedRows;
}

async function obtenerOrdenesParaGestionar() {

    const [filas] = await conexion.query(`
        SELECT
            o.id_orden,
            o.numero_consecutivo,
            o.prioridad,
            o.estado,
            o.id_tecnico,
            m.codigo AS codigo_maquina,
            m.nombre AS nombre_maquina,
            u.nombre AS nombre_tecnico
        FROM orden_de_trabajo o
        INNER JOIN solicitud s
            ON o.id_solicitud = s.id_solicitud
        INNER JOIN maquina m
            ON s.id_maquina = m.id_maquina
        LEFT JOIN usuario u
            ON o.id_tecnico = u.id_usuario
        WHERE o.estado IN ('Pendiente', 'En proceso')
        ORDER BY o.id_orden DESC
    `);

    return filas;
}

async function anularOrden(idOrden) {

    const [intervenciones] = await conexion.query(
        `SELECT id_intervencion
         FROM intervencion
         WHERE id_orden = ?`,
        [idOrden]
    );


    if (intervenciones.length > 0) {
        return "TIENE_INTERVENCION";
    }


    const [resultado] = await conexion.query(
        `UPDATE orden_de_trabajo
         SET estado = 'Anulada'
         WHERE id_orden = ?
         AND estado = 'Pendiente'`,
        [idOrden]
    );


    if (resultado.affectedRows === 0) {
        return "NO_MODIFICADA";
    }


    return "ANULADA";
}

async function cancelarOrden(idOrden) {

    const [resultado] = await conexion.query(`
        UPDATE orden_de_trabajo o
        SET estado = 'Cancelada'
        WHERE o.id_orden = ?
        AND o.estado = 'Pendiente'
        AND NOT EXISTS (
            SELECT 1
            FROM intervencion i
            WHERE i.id_orden = o.id_orden
        )
    `, [idOrden]);

    return resultado.affectedRows;
}

module.exports = {
    obtenerOrdenesJefe,
    obtenerOrdenesParaAsignar,
    asignarTecnico,
    obtenerOrdenesParaGestionar,
    cancelarOrden
};