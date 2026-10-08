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

module.exports = {
    obtenerResumenJefe
};