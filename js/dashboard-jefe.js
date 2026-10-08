const usuario = localStorage.getItem("usuario");
const rol = localStorage.getItem("rol");

if (!usuario || !rol) {
    window.location.href = "../index.html";
}

if (rol !== "jefe") {
    window.location.href = "../index.html";
}

const usuarioSesion = document.getElementById("usuarioSesion");

if (usuarioSesion) {
    usuarioSesion.textContent = usuario;
}


async function cargarResumen() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/jefe/resumen"
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            console.error(datos.mensaje);
            return;
        }

        document.getElementById("otPendientes").textContent =
            datos.pendientes;

        document.getElementById("otUrgentes").textContent =
            datos.urgentes;

        document.getElementById("otEnEjecucion").textContent =
            datos.enEjecucion;

        document.getElementById("otActivas").textContent =
            datos.activas;

        document.getElementById("preventivosProgramados").textContent =
            datos.preventivosProgramados;

    } catch (error) {

        console.error(
            "Error al cargar resumen del jefe:",
            error
        );
    }
}


cargarResumen();