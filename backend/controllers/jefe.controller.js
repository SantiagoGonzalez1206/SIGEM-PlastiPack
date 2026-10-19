const {

    obtenerResumenJefe,

    obtenerAlertasJefe,

    obtenerSolicitudesPendientes,

    validarSolicitud

} = require("../models/jefe.model");


async function obtenerResumen(req, res) {

    try {

        const resumen =
            await obtenerResumenJefe();

        res.json(resumen);

    } catch (error) {

        console.error(
            "Error al obtener resumen del jefe:",
            error
        );

        res.status(500).json({

            mensaje:
                "Error al consultar el resumen."

        });

    }

}


async function obtenerAlertas(req, res) {

    try {

        const alertas =
            await obtenerAlertasJefe();

        res.json(alertas);

    } catch (error) {

        console.error(
            "Error al obtener alertas del jefe:",
            error
        );

        res.status(500).json({

            mensaje:
                "Error al consultar las alertas."

        });

    }

}


/* ==========================================
   RF-03
   ========================================== */

async function listarSolicitudesPendientes(
    req,
    res
) {

    try {

        const solicitudes =
            await obtenerSolicitudesPendientes();

        res.json(solicitudes);

    } catch (error) {

        console.error(
            "Error al obtener solicitudes pendientes:",
            error
        );

        res.status(500).json({

            mensaje:
                "Error al consultar las solicitudes."

        });

    }

}


/* ==========================================
   RF-03 + RF-04 + RF-05
   ========================================== */

async function validarSolicitudJefe(
    req,
    res
) {

    try {

        const idSolicitud =
            req.params.id;


        if (!idSolicitud) {

            return res.status(400).json({

                mensaje:
                    "La solicitud es obligatoria."

            });

        }


        const resultado =
            await validarSolicitud(
                idSolicitud
            );


        if (
            resultado.codigo ===
            "NO_DISPONIBLE"
        ) {

            return res.status(404).json({

                mensaje:
                    "La solicitud no existe o ya fue validada."

            });

        }


        if (
            resultado.codigo ===
            "INFORMACION_INSUFICIENTE"
        ) {

            return res.status(400).json({

                mensaje:
                    "La solicitud no contiene información suficiente para continuar."

            });

        }


        res.json({

            mensaje:
                "Solicitud validada y orden de trabajo generada correctamente.",

            prioridad:
                resultado.prioridad,

            numeroOrden:
                resultado.numeroConsecutivo

        });


    } catch (error) {

        console.error(
            "Error al validar solicitud:",
            error
        );

        res.status(500).json({

            mensaje:
                "Error al validar la solicitud."

        });

    }

}


module.exports = {

    obtenerResumen,

    obtenerAlertas,

    listarSolicitudesPendientes,

    validarSolicitudJefe

};