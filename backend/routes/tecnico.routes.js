const express = require("express");

const router = express.Router();

const {
    listarTecnicos,
    listarOrdenesTecnico,
    obtenerDetalleOrden,
    listarRepuestos,
    obtenerIntervencionOrden,
    obtenerRepuestosOrdenTecnico,
    registrarDiagnostico,
    registrarTiempo,
    registrarEstado,
    registrarRepuesto,
    cerrarOrdenTecnico
} = require("../controllers/tecnico.controller");


// =====================================================
// LISTAR TÉCNICOS
// =====================================================

router.get(
    "/",
    listarTecnicos
);


// =====================================================
// ÓRDENES DEL TÉCNICO
// =====================================================

router.get(
    "/ordenes",
    listarOrdenesTecnico
);


// =====================================================
// DETALLE DE UNA ORDEN
// =====================================================

router.get(
    "/ordenes/:id",
    obtenerDetalleOrden
);


// =====================================================
// INTERVENCIÓN DE UNA ORDEN
// =====================================================

router.get(
    "/ordenes/:id/intervencion",
    obtenerIntervencionOrden
);


// =====================================================
// REPUESTOS DISPONIBLES
// =====================================================

router.get(
    "/repuestos",
    listarRepuestos
);


// =====================================================
// REPUESTOS UTILIZADOS EN UNA ORDEN
// =====================================================

router.get(
    "/ordenes/:id/repuestos",
    obtenerRepuestosOrdenTecnico
);


// =====================================================
// DIAGNÓSTICO
// =====================================================

router.post(
    "/ordenes/:id/diagnostico",
    registrarDiagnostico
);


// =====================================================
// TIEMPO DE REPARACIÓN
// =====================================================

router.post(
    "/ordenes/:id/tiempo",
    registrarTiempo
);


// =====================================================
// ESTADO DE LA MÁQUINA
// =====================================================

router.patch(
    "/ordenes/:id/estado",
    registrarEstado
);


// =====================================================
// REGISTRAR REPUESTO
// =====================================================

router.post(
    "/ordenes/:id/repuestos",
    registrarRepuesto
);


// =====================================================
// CERRAR ORDEN
// =====================================================

router.patch(
    "/ordenes/:id/cerrar",
    cerrarOrdenTecnico
);


module.exports = router;