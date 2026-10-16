const express = require("express");

const router = express.Router();

const {
    listarPreventivos,
    listarMaquinasPreventivo,
    registrarPreventivo
} = require("../controllers/preventivos-jefe.controller");

router.get("/", listarPreventivos);

router.get("/maquinas", listarMaquinasPreventivo);

router.post("/", registrarPreventivo);

module.exports = router;