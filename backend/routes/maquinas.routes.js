const express = require("express");

const router = express.Router();

const {
    listarMaquinas,
    buscarMaquinaPorCodigo
} = require("../controllers/maquinas.controller");


router.get("/", listarMaquinas);

router.get("/:codigo", buscarMaquinaPorCodigo);


module.exports = router;