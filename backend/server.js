const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes/api.routes");
const authRoutes = require("./routes/auth.routes");
const maquinasRoutes = require("./routes/maquinas.routes");
const solicitudesRoutes = require("./routes/solicitudes.routes");

const app = express();

const PORT = 3000;


// Middlewares

app.use(cors());

app.use(express.json());


// Rutas

app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/maquinas", maquinasRoutes);
app.use("/api/solicitudes", solicitudesRoutes);


// Servidor

app.listen(PORT, function() {
    console.log(`Servidor SIGEM ejecutándose en http://localhost:${PORT}`);
});