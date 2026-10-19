const express = require("express");

const router = express.Router();

const {
    listarPreventivos,
    listarMaquinasPreventivo,
    registrarPreventivo,
    editarPreventivo,
    anularPreventivo
} = require("../controllers/preventivos-jefe.controller");


router.get(
    "/",
    listarPreventivos
);


router.get(
    "/maquinas",
    listarMaquinasPreventivo
);


router.post(
    "/",
    registrarPreventivo
);


router.put(
    "/:id",
    editarPreventivo
);


router.patch(
    "/:id/cancelar",
    anularPreventivo
);


module.exports = router;