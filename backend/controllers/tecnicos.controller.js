const {
    obtenerTecnicos
} = require("../models/tecnico.model");

async function listarTecnicos(req, res) {

    try {

        const tecnicos = await obtenerTecnicos();

        res.json(tecnicos);

    } catch (error) {

        console.error(
            "Error al obtener técnicos:",
            error
        );

        res.status(500).json({
            mensaje: "Error al consultar los técnicos."
        });
    }
}

module.exports = {
    listarTecnicos
};