const express = require("express");

const router = express.Router();

const {
    listarOrdenesJefe,
    listarOrdenesParaAsignar,
    asignarTecnicoOrden
} = require("../controllers/ordenes-jefe.controller");

router.get("/", listarOrdenesJefe);
router.get("/pendientes", listarOrdenesParaAsignar);
router.post("/asignar", asignarTecnicoOrden);

module.exports = router;