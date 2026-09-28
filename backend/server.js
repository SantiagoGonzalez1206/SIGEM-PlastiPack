const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes/api.routes");
const authRoutes = require("./routes/auth.routes");
const maquinasRoutes = require("./routes/maquinas.routes");
const solicitudesRoutes = require("./routes/solicitudes.routes");

const conexion = require("./config/database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/maquinas", maquinasRoutes);
app.use("/api/solicitudes", solicitudesRoutes);

conexion.getConnection()
    .then(function(connection) {
        console.log("Conexión con MySQL establecida correctamente.");
        connection.release();
    })
    .catch(function(error) {
        console.error("Error al conectar con MySQL:", error.message);
    });

app.listen(PORT, function() {
    console.log(`Servidor SIGEM ejecutándose en http://localhost:${PORT}`);
});