const {
    obtenerPreventivos,
    obtenerMaquinasParaPreventivo,
    crearPreventivo
} = require("../models/preventivo.model");


async function listarPreventivos(req, res) {

    try {

        const preventivos =
            await obtenerPreventivos();

        res.json(preventivos);

    } catch (error) {

        console.error(
            "Error al obtener preventivos:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al consultar los mantenimientos preventivos."
        });
    }
}


async function listarMaquinasPreventivo(req, res) {

    try {

        const maquinas =
            await obtenerMaquinasParaPreventivo();

        res.json(maquinas);

    } catch (error) {

        console.error(
            "Error al obtener máquinas:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al consultar las máquinas."
        });
    }
}


async function registrarPreventivo(req, res) {

    try {

        const {
            actividad,
            frecuencia,
            proximaFecha,
            idMaquina
        } = req.body;


        if (
            !actividad ||
            !frecuencia ||
            !proximaFecha ||
            !idMaquina
        ) {

            return res.status(400).json({
                mensaje:
                    "Todos los campos son obligatorios."
            });
        }


        await crearPreventivo(
            actividad,
            frecuencia,
            proximaFecha,
            idMaquina
        );


        res.status(201).json({
            mensaje:
                "Mantenimiento preventivo programado correctamente."
        });

    } catch (error) {

        console.error(
            "Error al registrar preventivo:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al registrar el mantenimiento preventivo."
        });
    }
}


module.exports = {
    listarPreventivos,
    listarMaquinasPreventivo,
    registrarPreventivo
};