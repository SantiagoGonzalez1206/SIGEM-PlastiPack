const conexion = require("../config/database");

async function obtenerTecnicos() {

    const [filas] = await conexion.query(`
        SELECT
            u.id_usuario,
            u.nombre,
            u.usuario_institucional
        FROM usuario u
        INNER JOIN rol r
            ON u.id_rol = r.id_rol
        WHERE r.nombre = 'Técnico de mantenimiento'
        AND u.habilitado = TRUE
        ORDER BY u.nombre
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

module.exports = {
    obtenerTecnicos,
    obtenerOrdenesParaAsignar
};