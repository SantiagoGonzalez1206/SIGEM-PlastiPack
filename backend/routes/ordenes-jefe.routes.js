const express = require("express");

const router = express.Router();

const {
    listarOrdenesJefe,
    listarOrdenesParaAsignar,
    asignarTecnicoOrden,
    listarOrdenesParaGestionar,
    anularOrdenTrabajo,
    cancelarOrdenTrabajo
} = require("../controllers/ordenes-jefe.controller");

router.get("/", listarOrdenesJefe);
router.get("/pendientes", listarOrdenesParaAsignar);
router.post("/asignar", asignarTecnicoOrden);
router.get( "/gestionar", listarOrdenesParaGestionar);
router.patch("/:id/anular",anularOrdenTrabajo);
router.patch("/:id/cancelar", cancelarOrdenTrabajo);

module.exports = router;