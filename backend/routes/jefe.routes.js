const express = require("express");

const router = express.Router();

const {
    obtenerResumen,
    obtenerAlertas
} = require("../controllers/jefe.controller");

router.get("/resumen", obtenerResumen);
router.get("/alertas", obtenerAlertas);

module.exports = router;