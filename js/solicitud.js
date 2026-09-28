const formularioSolicitud = document.getElementById("formularioSolicitud");

const codigoMaquina = document.getElementById("codigoMaquina");
const nombreMaquina = document.getElementById("nombreMaquina");
const ubicacion = document.getElementById("ubicacion");

const mensajeSolicitud = document.getElementById("mensajeSolicitud");

const usuario = localStorage.getItem("usuario");
const rol = localStorage.getItem("rol");


// Verificar que exista una sesión
if (!usuario || !rol) {
    window.location.href = "../index.html";
}


// Verificar que el usuario sea operario
if (rol !== "operario") {
    window.location.href = "../index.html";
}


// Mostrar usuario de la sesión
const usuarioSesion = document.getElementById("usuarioSesion");

if (usuarioSesion) {
    usuarioSesion.textContent = usuario;
}


// Validar máquina cuando se escribe su código
codigoMaquina.addEventListener("blur", async function() {

    const codigo = codigoMaquina.value.trim().toUpperCase();

    if (codigo === "") {
        nombreMaquina.value = "";
        ubicacion.value = "";
        return;
    }

    try {

        const respuesta = await fetch(
            `http://localhost:3000/api/maquinas/${codigo}`
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            nombreMaquina.value = "";
            ubicacion.value = "";

            mensajeSolicitud.textContent = datos.mensaje;
            mensajeSolicitud.style.color = "red";

            return;
        }

        nombreMaquina.value = datos.nombre;
        ubicacion.value = datos.ubicacion;

        mensajeSolicitud.textContent = "";

    } catch (error) {

        mensajeSolicitud.textContent =
            "No se pudo conectar con el servidor.";

        mensajeSolicitud.style.color = "red";

        console.error("Error:", error);
    }
});


// Registrar solicitud
formularioSolicitud.addEventListener("submit", async function(evento) {

    evento.preventDefault();

    const datosSolicitud = {

        codigoMaquina: codigoMaquina.value.trim().toUpperCase(),

        tipoMantenimiento:
            document.getElementById("tipoMantenimiento").value,

        descripcionFalla:
            document.getElementById("descripcionFalla").value.trim(),

        prioridad:
            document.getElementById("prioridad").value,

        usuario: usuario
    };


    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/solicitudes",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(datosSolicitud)
            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            mensajeSolicitud.textContent = datos.mensaje;
            mensajeSolicitud.style.color = "red";

            return;
        }


        mensajeSolicitud.textContent =
            datos.mensaje;

        mensajeSolicitud.style.color = "green";


        formularioSolicitud.reset();

        nombreMaquina.value = "";
        ubicacion.value = "";


    } catch (error) {

        mensajeSolicitud.textContent =
            "No se pudo conectar con el servidor.";

        mensajeSolicitud.style.color = "red";

        console.error("Error:", error);
    }

});