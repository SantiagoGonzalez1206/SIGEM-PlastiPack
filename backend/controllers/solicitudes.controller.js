const {
    obtenerSolicitudes,
    obtenerSolicitudesPorUsuario,
    crearSolicitud
} = require("../models/solicitud.model");

async function registrarSolicitud(req, res) {

    try {

        const {
            codigoMaquina,
            tipoMantenimiento,
            descripcionFalla,
            prioridad,
            usuario
        } = req.body;


        if (
            !codigoMaquina ||
            !tipoMantenimiento ||
            !descripcionFalla ||
            !prioridad ||
            !usuario
        ) {

            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios."
            });
        }


        const idSolicitud = await crearSolicitud(
            tipoMantenimiento,
            descripcionFalla,
            prioridad,
            usuario,
            codigoMaquina
        );


        if (!idSolicitud) {

            return res.status(404).json({
                mensaje: "El usuario o la máquina no existen."
            });
        }


        res.status(201).json({
            mensaje: "Solicitud registrada correctamente.",
            idSolicitud: idSolicitud
        });

    } catch (error) {

        console.error("Error al registrar solicitud:", error);

        res.status(500).json({
            mensaje: "Error al registrar la solicitud."
        });
    }
}


async function listarSolicitudes(req, res) {

    try {

        const solicitudes = await obtenerSolicitudes();

        res.json(solicitudes);

    } catch (error) {

        console.error("Error al obtener solicitudes:", error);

        res.status(500).json({
            mensaje: "Error al consultar las solicitudes."
        });
    }
}

async function listarSolicitudesPorUsuario(req, res) {

    try {

        const usuario = req.params.usuario;

        const solicitudes =
            await obtenerSolicitudesPorUsuario(usuario);

        res.json(solicitudes);

    } catch (error) {

        console.error(
            "Error al obtener solicitudes del usuario:",
            error
        );

        res.status(500).json({
            mensaje: "Error al consultar las solicitudes."
        });
    }
}

module.exports = {
    registrarSolicitud,
    listarSolicitudes,
    listarSolicitudesPorUsuario
};