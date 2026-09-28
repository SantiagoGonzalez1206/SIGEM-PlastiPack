const express = require("express");

const router = express.Router();

const {
    crearSolicitud,
    obtenerSolicitudes
} = require("../controllers/solicitudes.controller");


router.post("/", crearSolicitud);

router.get("/", obtenerSolicitudes);


module.exports = router;