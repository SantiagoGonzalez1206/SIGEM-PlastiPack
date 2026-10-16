const conexion = require("../config/database");


async function obtenerPreventivos() {

    const [filas] = await conexion.query(`
        SELECT
            p.id_preventivo,
            p.actividad,
            p.frecuencia,
            p.proxima_fecha,
            p.estado,
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


module.exports = {
    obtenerPreventivos,
    obtenerMaquinasParaPreventivo,
    crearPreventivo
};