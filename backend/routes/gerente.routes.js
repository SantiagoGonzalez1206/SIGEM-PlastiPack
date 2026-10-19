const express = require("express");

const router =
    express.Router();


const {

    obtenerResumen,

    obtenerReportes,

    obtenerIndicadores

} = require("../controllers/gerente.controller");



router.get(
    "/resumen",
    obtenerResumen
);


router.get(
    "/reportes",
    obtenerReportes
);


router.get(
    "/indicadores",
    obtenerIndicadores
);


module.exports = router;