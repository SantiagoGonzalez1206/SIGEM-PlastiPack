const {
    obtenerOrdenesJefe,
    obtenerOrdenesParaAsignar,
    obtenerOrdenesParaGestionar,
    asignarTecnico,
    cancelarOrden
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


        if (!idOrden) {

            return res.status(400).json({
                mensaje:
                    "La orden es obligatoria."
            });
        }


        const resultado =
            await asignarTecnico(
                idOrden,
                idTecnico || null
            );


        if (resultado === 0) {

            return res.status(404).json({
                mensaje:
                    "La orden no existe o ya no puede modificarse."
            });
        }


        res.json({
            mensaje:
                idTecnico
                    ? "Técnico asignado correctamente."
                    : "Técnico desasignado correctamente."
        });


    } catch (error) {

        console.error(
            "Error al gestionar técnico:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al gestionar el técnico."
        });
    }
}

async function listarOrdenesParaGestionar(req, res) {

    try {

        const ordenes =
            await obtenerOrdenesParaGestionar();

        res.json(ordenes);

    } catch (error) {

        console.error(
            "Error al obtener órdenes para gestionar:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al consultar las órdenes."
        });
    }
}

async function listarOrdenesParaGestionar(req, res) {

    try {

        const ordenes =
            await obtenerOrdenesParaGestionar();

        res.json(ordenes);

    } catch (error) {

        console.error(
            "Error al obtener órdenes para gestionar:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al consultar las órdenes."
        });
    }
}

async function anularOrdenTrabajo(req, res) {

    try {

        const resultado =
            await anularOrden(
                req.params.id
            );


        if (resultado === "TIENE_INTERVENCION") {

            return res.status(400).json({
                mensaje:
                    "La orden no puede anularse porque ya tiene una intervención registrada."
            });
        }


        if (resultado === "NO_MODIFICADA") {

            return res.status(400).json({
                mensaje:
                    "La orden no existe o ya no puede anularse."
            });
        }


        res.json({
            mensaje:
                "Orden de trabajo anulada correctamente."
        });


    } catch (error) {

        console.error(
            "Error al anular orden:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al anular la orden."
        });
    }
}

async function cancelarOrdenTrabajo(req, res) {

    try {

        const idOrden = req.params.id;

        const resultado =
            await cancelarOrden(idOrden);

        if (resultado === 0) {

            return res.status(400).json({
                mensaje:
                    "La orden no se puede cancelar. Verifica que esté pendiente y que no tenga intervenciones."
            });
        }

        res.json({
            mensaje:
                "Orden de trabajo cancelada correctamente."
        });

    } catch (error) {

        console.error(
            "Error al cancelar orden:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al cancelar la orden de trabajo."
        });
    }
}

module.exports = {
    listarOrdenesJefe,
    listarOrdenesParaAsignar,
    asignarTecnicoOrden,
    listarOrdenesParaGestionar,
    anularOrdenTrabajo,
    cancelarOrdenTrabajo
};