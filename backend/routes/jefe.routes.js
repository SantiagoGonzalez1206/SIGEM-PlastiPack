const express = require("express");

const router = express.Router();


const {

    obtenerResumen,

    obtenerAlertas,

    listarSolicitudesPendientes,

    validarSolicitudJefe

} = require("../controllers/jefe.controller");


router.get(
    "/resumen",
    obtenerResumen
);


router.get(
    "/alertas",
    obtenerAlertas
);


/* ==========================================
   RF-03
========================================== */

router.get(
    "/solicitudes/pendientes",
    listarSolicitudesPendientes
);


/* ==========================================
   RF-03 + RF-04 + RF-05
========================================== */

router.patch(
    "/solicitudes/:id/validar",
    validarSolicitudJefe
);


module.exports = router;