const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes/api.routes");
const authRoutes = require("./routes/auth.routes");
const maquinasRoutes = require("./routes/maquinas.routes");
const solicitudesRoutes = require("./routes/solicitudes.routes");
const jefeRoutes = require("./routes/jefe.routes");
const ordenesJefeRoutes = require("./routes/ordenes-jefe.routes");
const preventivosJefeRoutes = require("./routes/preventivos-jefe.routes");
const tecnicoRoutes =require("./routes/tecnico.routes");
const historialRoutes =require("./routes/historial.routes");
const gerenteRoutes =require("./routes/gerente.routes");

const conexion = require("./config/database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/maquinas", maquinasRoutes);
app.use("/api/solicitudes", solicitudesRoutes);
app.use("/api/jefe", jefeRoutes);
app.use("/api/jefe/ordenes", ordenesJefeRoutes);
app.use("/api/tecnicos", tecnicoRoutes);
app.use("/api/jefe/preventivos",preventivosJefeRoutes);
app.use("/api/tecnico",tecnicoRoutes);
app.use("/api/historial",historialRoutes);
app.use("/api/gerente",gerenteRoutes);


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