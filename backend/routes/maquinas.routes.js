const express = require("express");

const router = express.Router();

const {
    obtenerMaquinas,
    obtenerMaquinaPorCodigo
} = require("../controllers/maquinas.controller");


router.get("/", obtenerMaquinas);

router.get("/:codigo", obtenerMaquinaPorCodigo);


module.exports = router;