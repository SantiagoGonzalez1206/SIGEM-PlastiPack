const express = require("express");

const router = express.Router();

const {
    registrarSolicitud,
    listarSolicitudes,
    listarSolicitudesPorUsuario
} = require("../controllers/solicitudes.controller");

router.post("/", registrarSolicitud);

router.get("/", listarSolicitudes);

router.get("/usuario/:usuario", listarSolicitudesPorUsuario);


module.exports = router;