const {
    obtenerMaquinas,
    obtenerMaquinaPorCodigo
} = require("../models/maquina.model");


async function listarMaquinas(req, res) {

    try {

        const maquinas = await obtenerMaquinas();

        res.json(maquinas);

    } catch (error) {

        console.error("Error al obtener máquinas:", error);

        res.status(500).json({
            mensaje: "Error al consultar las máquinas."
        });
    }
}


async function buscarMaquinaPorCodigo(req, res) {

    try {

        const codigo = req.params.codigo;

        const maquina = await obtenerMaquinaPorCodigo(codigo);

        if (!maquina) {

            return res.status(404).json({
                mensaje: "La máquina no existe."
            });
        }

        res.json(maquina);

    } catch (error) {

        console.error("Error al buscar máquina:", error);

        res.status(500).json({
            mensaje: "Error al consultar la máquina."
        });
    }
}


module.exports = {
    listarMaquinas,
    buscarMaquinaPorCodigo
};