const express = require("express");

const router = express.Router();

const {
    obtenerResumen
} = require("../controllers/jefe.controller");

router.get("/resumen", obtenerResumen);

module.exports = router;