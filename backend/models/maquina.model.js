const conexion = require("../config/database");

async function obtenerMaquinas() {

    const [filas] = await conexion.query(
        "SELECT * FROM maquina"
    );

    return filas;
}


async function obtenerMaquinaPorCodigo(codigo) {

    const [filas] = await conexion.query(
        "SELECT * FROM maquina WHERE codigo = ?",
        [codigo]
    );

    return filas[0];
}


module.exports = {
    obtenerMaquinas,
    obtenerMaquinaPorCodigo
};