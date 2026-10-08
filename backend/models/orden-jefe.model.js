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
         WHERE id_orden = ?`,
        [idTecnico, idOrden]
    );

    return resultado.affectedRows;
}

module.exports = {
    obtenerOrdenesJefe,
    obtenerOrdenesParaAsignar,
    asignarTecnico
};