const express = require("express");

const router = express.Router();

const { estadoAPI } = require("../controllers/api.controller");

router.get("/", estadoAPI);

module.exports = router;