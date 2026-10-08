const {
    obtenerResumenJefe
} = require("../models/jefe.model");

async function obtenerResumen(req, res) {

    try {

        const resumen = await obtenerResumenJefe();

        res.json(resumen);

    } catch (error) {

        console.error(
            "Error al obtener resumen del jefe:",
            error
        );

        res.status(500).json({
            mensaje: "Error al consultar el resumen."
        });
    }
}

module.exports = {
    obtenerResumen
};