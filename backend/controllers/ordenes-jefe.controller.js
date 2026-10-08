const {
    obtenerOrdenesJefe,
    obtenerOrdenesParaAsignar,
    asignarTecnico
} = require("../models/orden-jefe.model");

async function listarOrdenesJefe(req, res) {

    try {

        const ordenes = await obtenerOrdenesJefe();

        res.json(ordenes);

    } catch (error) {

        console.error(
            "Error al obtener órdenes del jefe:",
            error
        );

        res.status(500).json({
            mensaje: "Error al consultar las órdenes."
        });
    }
}
async function listarOrdenesParaAsignar(req, res) {

    try {

        const ordenes = await obtenerOrdenesParaAsignar();

        res.json(ordenes);

    } catch (error) {

        console.error(
            "Error al obtener órdenes para asignar:",
            error
        );

        res.status(500).json({
            mensaje: "Error al consultar las órdenes."
        });
    }
}

async function asignarTecnicoOrden(req, res) {

    try {

        const {
            idOrden,
            idTecnico
        } = req.body;

        if (!idOrden || !idTecnico) {

            return res.status(400).json({
                mensaje: "La orden y el técnico son obligatorios."
            });
        }

        const resultado = await asignarTecnico(
            idOrden,
            idTecnico
        );

        if (resultado === 0) {

            return res.status(404).json({
                mensaje: "La orden no existe."
            });
        }

        res.json({
            mensaje: "Técnico asignado correctamente."
        });

    } catch (error) {

        console.error(
            "Error al asignar técnico:",
            error
        );

        res.status(500).json({
            mensaje: "Error al asignar el técnico."
        });
    }
}

module.exports = {
    listarOrdenesJefe,
    listarOrdenesParaAsignar,
    asignarTecnicoOrden
};