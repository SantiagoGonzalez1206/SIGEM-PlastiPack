const express = require("express");

const router =
    express.Router();


const {
    listarMaquinas,
    consultarHistorial
} = require("../controllers/historial.controller");


router.get(
    "/maquinas",
    listarMaquinas
);


router.get(
    "/maquinas/:id",
    consultarHistorial
);


module.exports = router;