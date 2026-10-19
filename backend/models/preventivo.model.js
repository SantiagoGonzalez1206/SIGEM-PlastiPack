const conexion = require("../config/database");


async function obtenerPreventivos() {

    const [filas] = await conexion.query(`
        SELECT
            p.id_preventivo,
            p.actividad,
            p.frecuencia,
            p.proxima_fecha,

            CASE
                WHEN p.estado = 'Cancelado'
                    THEN 'Cancelado'

                WHEN p.proxima_fecha < CURDATE()
                    THEN 'Vencido'

                WHEN p.proxima_fecha <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
                    THEN 'Próximo a vencer'

                ELSE 'Programado'
            END AS estado,

            m.codigo AS codigo_maquina,
            m.nombre AS nombre_maquina

        FROM mantenimiento_preventivo p

        INNER JOIN maquina m
            ON p.id_maquina = m.id_maquina

        ORDER BY p.proxima_fecha ASC
    `);

    return filas;
}


async function obtenerMaquinasParaPreventivo() {

    const [filas] = await conexion.query(`
        SELECT
            id_maquina,
            codigo,
            nombre
        FROM maquina
        ORDER BY codigo
    `);

    return filas;
}


async function crearPreventivo(
    actividad,
    frecuencia,
    proximaFecha,
    idMaquina
) {

    const [resultado] = await conexion.query(
        `INSERT INTO mantenimiento_preventivo
        (
            actividad,
            frecuencia,
            proxima_fecha,
            estado,
            id_maquina
        )
        VALUES (?, ?, ?, 'Programado', ?)`,
        [
            actividad,
            frecuencia,
            proximaFecha,
            idMaquina
        ]
    );

    return resultado.insertId;
}


async function actualizarPreventivo(
    idPreventivo,
    actividad,
    frecuencia,
    proximaFecha,
    idMaquina
) {

    const [resultado] = await conexion.query(
        `UPDATE mantenimiento_preventivo
         SET
            actividad = ?,
            frecuencia = ?,
            proxima_fecha = ?,
            id_maquina = ?
         WHERE id_preventivo = ?
         AND estado <> 'Cancelado'`,
        [
            actividad,
            frecuencia,
            proximaFecha,
            idMaquina,
            idPreventivo
        ]
    );

    return resultado.affectedRows;
}


async function cancelarPreventivo(idPreventivo) {

    const [resultado] = await conexion.query(
        `UPDATE mantenimiento_preventivo
         SET estado = 'Cancelado'
         WHERE id_preventivo = ?
         AND estado <> 'Cancelado'`,
        [idPreventivo]
    );

    return resultado.affectedRows;
}


module.exports = {
    obtenerPreventivos,
    obtenerMaquinasParaPreventivo,
    crearPreventivo,
    actualizarPreventivo,
    cancelarPreventivo
};