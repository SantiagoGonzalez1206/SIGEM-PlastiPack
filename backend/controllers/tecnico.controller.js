const tecnicoModel = require("../models/tecnico.model");

const {
    obtenerOrdenesTecnico,
    obtenerOrdenTecnico,
    obtenerIntervencion,
    obtenerRepuestos,
    obtenerRepuestosOrden,
    guardarDiagnostico,
    guardarTiempoReparacion,
    actualizarEstadoMaquina,
    agregarRepuesto,
    cerrarOrden
} = require("../models/tecnico.model");


// =====================================================
// LISTAR ÓRDENES DEL TÉCNICO
// =====================================================

async function listarOrdenesTecnico(req, res) {

    try {

        const usuario = req.query.usuario;

        if (!usuario) {

            return res.status(400).json({
                mensaje: "El usuario es obligatorio."
            });
        }

        const ordenes =
            await obtenerOrdenesTecnico(usuario);

        res.json(ordenes);

    } catch (error) {

        console.error(
            "Error al obtener órdenes del técnico:",
            error
        );

        res.status(500).json({
            mensaje: "Error al consultar las órdenes."
        });
    }
}


// =====================================================
// OBTENER DETALLE DE UNA ORDEN
// =====================================================

async function obtenerDetalleOrden(req, res) {

    try {

        const idOrden = req.params.id;
        const usuario = req.query.usuario;

        if (!usuario) {

            return res.status(400).json({
                mensaje: "El usuario es obligatorio."
            });
        }

        const orden =
            await obtenerOrdenTecnico(
                idOrden,
                usuario
            );

        if (!orden) {

            return res.status(404).json({
                mensaje:
                    "La orden no existe o no está asignada al técnico."
            });
        }

        const intervencion =
            await obtenerIntervencion(idOrden);

        const repuestos =
            await obtenerRepuestosOrden(idOrden);

        res.json({
            orden,
            intervencion: intervencion || null,
            repuestos
        });

    } catch (error) {

        console.error(
            "Error al obtener detalle:",
            error
        );

        res.status(500).json({
            mensaje: "Error al consultar la orden."
        });
    }
}


// =====================================================
// LISTAR REPUESTOS DISPONIBLES
// =====================================================

async function listarRepuestos(req, res) {

    try {

        const repuestos =
            await obtenerRepuestos();

        res.json(repuestos);

    } catch (error) {

        console.error(
            "Error al obtener repuestos:",
            error
        );

        res.status(500).json({
            mensaje: "Error al consultar los repuestos."
        });
    }
}


// =====================================================
// REGISTRAR DIAGNÓSTICO
// =====================================================

async function registrarDiagnostico(req, res) {

    try {

        const idOrden = req.params.id;

        const {
            diagnostico,
            fechaInicio
        } = req.body;

        if (!diagnostico || !fechaInicio) {

            return res.status(400).json({
                mensaje:
                    "El diagnóstico y la fecha de inicio son obligatorios."
            });
        }

        await guardarDiagnostico(
            idOrden,
            diagnostico,
            fechaInicio
        );

        res.json({
            mensaje:
                "Diagnóstico registrado correctamente."
        });

    } catch (error) {

        console.error(
            "Error al registrar diagnóstico:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al registrar el diagnóstico."
        });
    }
}


// =====================================================
// REGISTRAR TIEMPO DE REPARACIÓN
// =====================================================

async function registrarTiempo(req, res) {

    try {

        const idOrden = req.params.id;

        const {
            fechaInicio,
            fechaFin,
            tiempoReparacion
        } = req.body;

        if (
            !fechaInicio ||
            !fechaFin ||
            tiempoReparacion === undefined
        ) {

            return res.status(400).json({
                mensaje:
                    "Todos los datos del tiempo son obligatorios."
            });
        }

        if (Number(tiempoReparacion) < 0) {

            return res.status(400).json({
                mensaje:
                    "El tiempo de reparación no puede ser negativo."
            });
        }

        await guardarTiempoReparacion(
            idOrden,
            fechaInicio,
            fechaFin,
            tiempoReparacion
        );

        res.json({
            mensaje:
                "Tiempo de reparación registrado correctamente."
        });

    } catch (error) {

        console.error(
            "Error al registrar tiempo:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al registrar el tiempo de reparación."
        });
    }
}


// =====================================================
// ACTUALIZAR ESTADO DE LA MÁQUINA
// =====================================================

async function registrarEstado(req, res) {

    try {

        const idOrden = req.params.id;

        const {
            estadoEquipo
        } = req.body;

        const estadosPermitidos = [
            "Operativo",
            "En reparación",
            "Fuera de servicio"
        ];

        if (!estadosPermitidos.includes(estadoEquipo)) {

            return res.status(400).json({
                mensaje:
                    "El estado del equipo no es válido."
            });
        }

        await actualizarEstadoMaquina(
            idOrden,
            estadoEquipo
        );

        res.json({
            mensaje:
                "Estado del equipo actualizado correctamente."
        });

    } catch (error) {

        console.error(
            "Error al actualizar estado:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al actualizar el estado del equipo."
        });
    }
}


// =====================================================
// REGISTRAR REPUESTO
// =====================================================

async function registrarRepuesto(req, res) {

    try {

        const idOrden = req.params.id;

        const {
            idRepuesto,
            cantidad
        } = req.body;

        if (!idRepuesto || !cantidad) {

            return res.status(400).json({
                mensaje:
                    "El repuesto y la cantidad son obligatorios."
            });
        }

        if (Number(cantidad) <= 0) {

            return res.status(400).json({
                mensaje:
                    "La cantidad debe ser mayor que cero."
            });
        }

        const resultado =
            await agregarRepuesto(
                idOrden,
                idRepuesto,
                Number(cantidad)
            );

        if (resultado.error) {

            return res.status(400).json({
                mensaje: resultado.error
            });
        }

        res.json({
            mensaje:
                "Repuesto registrado correctamente."
        });

    } catch (error) {

        console.error(
            "Error al registrar repuesto:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al registrar el repuesto."
        });
    }
}


// =====================================================
// CERRAR ORDEN DE TRABAJO
// =====================================================

async function cerrarOrdenTecnico(req, res) {

    try {

        const idOrden = req.params.id;

        const resultado =
            await cerrarOrden(idOrden);

        if (!resultado.correcto) {

            return res.status(400).json({
                mensaje: resultado.mensaje
            });
        }

        res.json({
            mensaje: resultado.mensaje
        });

    } catch (error) {

        console.error(
            "Error al cerrar orden:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al cerrar la orden."
        });
    }
}


// =====================================================
// CONSULTAR INTERVENCIÓN
// =====================================================

async function obtenerIntervencionOrden(req, res) {

    try {

        const idOrden = req.params.id;

        const intervencion =
            await tecnicoModel.obtenerIntervencion(
                idOrden
            );

        res.json({
            intervencion:
                intervencion || null
        });

    } catch (error) {

        console.error(
            "Error al consultar intervención:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al consultar la intervención."
        });
    }
}


// =====================================================
// CONSULTAR REPUESTOS DE UNA ORDEN
// =====================================================

async function obtenerRepuestosOrdenTecnico(req, res) {

    try {

        const idOrden = req.params.id;

        const repuestos =
            await tecnicoModel.obtenerRepuestosOrden(
                idOrden
            );

        res.json({
            repuestos: repuestos || []
        });

    } catch (error) {

        console.error(
            "Error al consultar repuestos de la orden:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al consultar los repuestos de la orden."
        });
    }
}


// =====================================================
// EXPORTACIONES
// =====================================================

module.exports = {

    listarOrdenesTecnico,

    obtenerDetalleOrden,

    listarRepuestos,

    registrarDiagnostico,

    registrarTiempo,

    registrarEstado,

    registrarRepuesto,

    cerrarOrdenTecnico,

    obtenerIntervencionOrden,

    obtenerRepuestosOrdenTecnico

};