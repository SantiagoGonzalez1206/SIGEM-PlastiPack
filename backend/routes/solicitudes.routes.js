const express = require("express");

const router = express.Router();

const {
    registrarSolicitud,
    listarSolicitudes
} = require("../controllers/solicitudes.controller");


router.post("/", registrarSolicitud);

router.get("/", listarSolicitudes);


module.exports = router;