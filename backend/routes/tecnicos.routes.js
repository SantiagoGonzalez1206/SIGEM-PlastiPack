const express = require("express");

const router = express.Router();

const {
    listarTecnicos
} = require("../controllers/tecnicos.controller");

router.get("/", listarTecnicos);

module.exports = router;