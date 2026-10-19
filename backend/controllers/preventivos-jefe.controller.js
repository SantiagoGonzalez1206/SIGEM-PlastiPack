const {
    obtenerPreventivos,
    obtenerMaquinasParaPreventivo,
    crearPreventivo,
    actualizarPreventivo,
    cancelarPreventivo
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


async function editarPreventivo(req, res) {

    try {

        const idPreventivo =
            req.params.id;

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


        const resultado =
            await actualizarPreventivo(
                idPreventivo,
                actividad,
                frecuencia,
                proximaFecha,
                idMaquina
            );


        if (resultado === 0) {

            return res.status(404).json({
                mensaje:
                    "El mantenimiento no existe o está cancelado."
            });
        }


        res.json({
            mensaje:
                "Mantenimiento preventivo actualizado correctamente."
        });

    } catch (error) {

        console.error(
            "Error al editar preventivo:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al actualizar el mantenimiento preventivo."
        });
    }
}


async function anularPreventivo(req, res) {

    try {

        const idPreventivo =
            req.params.id;


        const resultado =
            await cancelarPreventivo(
                idPreventivo
            );


        if (resultado === 0) {

            return res.status(404).json({
                mensaje:
                    "El mantenimiento no existe o ya está cancelado."
            });
        }


        res.json({
            mensaje:
                "Mantenimiento preventivo cancelado correctamente."
        });

    } catch (error) {

        console.error(
            "Error al cancelar preventivo:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al cancelar el mantenimiento preventivo."
        });
    }
}


module.exports = {
    listarPreventivos,
    listarMaquinasPreventivo,
    registrarPreventivo,
    editarPreventivo,
    anularPreventivo
};