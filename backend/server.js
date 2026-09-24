const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes/api.routes");

const app = express();

const PORT = 3000;


// Middlewares

app.use(cors());

app.use(express.json());


// Rutas

app.use("/api", apiRoutes);


// Servidor

app.listen(PORT, function() {
    console.log(`Servidor SIGEM ejecutándose en http://localhost:${PORT}`);
});