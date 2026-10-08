const usuario = localStorage.getItem("usuario");
const rol = localStorage.getItem("rol");

if (!usuario || !rol) {
    window.location.href = "../index.html";
}

if (rol !== "operario") {
    window.location.href = "../index.html";
}

const usuarioSesion = document.getElementById("usuarioSesion");

if (usuarioSesion) {
    usuarioSesion.textContent = usuario;
}


async function cargarIndicadores() {
    try {
        const respuesta = await fetch(
            `http://localhost:3000/api/solicitudes/usuario/${usuario}`
        );

        const solicitudes = await respuesta.json();

        if (!respuesta.ok) {
            console.error("Error al consultar reportes:", solicitudes.mensaje);
            return;
        }

        let abiertos = 0;
        let revision = 0;
        let finalizados = 0;

        solicitudes.forEach(function(solicitud) {

            if (solicitud.estado === "Abierta") {
                abiertos++;
            }

            if (solicitud.estado === "En proceso") {
                revision++;
            }

            if (solicitud.estado === "Atendida") {
                finalizados++;
            }
        });

        document.querySelectorAll(".reportesAbiertos")
            .forEach(function(elemento) {
                elemento.textContent = abiertos;
            });

        document.querySelectorAll(".reportesRevision")
            .forEach(function(elemento) {
                elemento.textContent = revision;
            });

        document.querySelectorAll(".reportesFinalizados")
            .forEach(function(elemento) {
                elemento.textContent = finalizados;
            });

    } catch (error) {
        console.error("Error al cargar indicadores:", error);
    }
}

cargarIndicadores();