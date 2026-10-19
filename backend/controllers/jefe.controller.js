const {
    obtenerResumenJefe,
    obtenerAlertasJefe
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

async function obtenerAlertas(req, res) {
    try {
        const alertas = await obtenerAlertasJefe();

        res.json(alertas);
    } catch (error) {
        console.error("Error al obtener alertas del jefe:", error);

        res.status(500).json({
            mensaje: "Error al consultar las alertas."
        });
    }
}


module.exports = {
    obtenerResumen,
    obtenerAlertas
};