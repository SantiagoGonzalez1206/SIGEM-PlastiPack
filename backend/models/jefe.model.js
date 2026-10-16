const conexion = require("../config/database");

async function obtenerResumenJefe() {

    const [ordenes] = await conexion.query(`
        SELECT
            SUM(CASE WHEN estado = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes,
            SUM(CASE WHEN estado = 'En proceso' THEN 1 ELSE 0 END) AS enEjecucion,
            SUM(
                CASE
                    WHEN estado IN ('Pendiente', 'En proceso') THEN 1
                    ELSE 0
                END
            ) AS activas,
            SUM(
                CASE
                    WHEN estado IN ('Pendiente', 'En proceso')
                    AND prioridad = 'Alta'
                    THEN 1
                    ELSE 0
                END
            ) AS urgentes
        FROM orden_de_trabajo
    `);

    const [preventivos] = await conexion.query(`
        SELECT COUNT(*) AS programados
        FROM mantenimiento_preventivo
        WHERE estado = 'Programado'
    `);

    return {
        pendientes: ordenes[0].pendientes || 0,
        enEjecucion: ordenes[0].enEjecucion || 0,
        activas: ordenes[0].activas || 0,
        urgentes: ordenes[0].urgentes || 0,
        preventivosProgramados: preventivos[0].programados || 0
    };
}

async function obtenerAlertasJefe() {

    const [preventivos] = await conexion.query(`
        SELECT
            p.id_preventivo,
            p.proxima_fecha,
            m.codigo AS codigo_maquina,
            m.nombre AS nombre_maquina
        FROM mantenimiento_preventivo p
        INNER JOIN maquina m
            ON p.id_maquina = m.id_maquina
        WHERE p.proxima_fecha >= CURDATE()
        AND p.proxima_fecha <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
        ORDER BY p.proxima_fecha ASC
        LIMIT 1
    `);

    const [ordenes] = await conexion.query(`
        SELECT
            o.id_orden,
            o.numero_consecutivo,
            o.prioridad,
            o.estado,
            m.codigo AS codigo_maquina,
            m.nombre AS nombre_maquina
        FROM orden_de_trabajo o
        INNER JOIN solicitud s
            ON o.id_solicitud = s.id_solicitud
        INNER JOIN maquina m
            ON s.id_maquina = m.id_maquina
        WHERE o.prioridad = 'Alta'
        AND o.estado IN ('Pendiente', 'En proceso')
        ORDER BY o.id_orden DESC
        LIMIT 1
    `);

    return {
        preventivo: preventivos[0] || null,
        ordenUrgente: ordenes[0] || null
    };
}

module.exports = {
    obtenerResumenJefe,
    obtenerAlertasJefe
};