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


const listaSolicitudes =
    document.getElementById("listaSolicitudes");


async function cargarSolicitudes() {

    try {

        const respuesta = await fetch(
            `http://localhost:3000/api/solicitudes/usuario/${usuario}`
        );

        const solicitudes = await respuesta.json();


        if (!respuesta.ok) {

            listaSolicitudes.innerHTML =
                "<p>No se pudieron consultar las solicitudes.</p>";

            return;
        }


        if (solicitudes.length === 0) {

            listaSolicitudes.innerHTML =
                "<p>No tienes solicitudes registradas.</p>";

            return;
        }


        let html = `
            <table class="tabla-solicitudes">

                <thead>

                    <tr>
                        <th>Solicitud</th>
                        <th>Máquina</th>
                        <th>Tipo</th>
                        <th>Prioridad</th>
                        <th>Estado</th>
                        <th>Orden de trabajo</th>
                    </tr>

                </thead>

                <tbody>
        `;


        solicitudes.forEach(function(solicitud) {

            html += `
                <tr>

                    <td>#${solicitud.id_solicitud}</td>

                    <td>
                        ${solicitud.codigoMaquina}
                        - ${solicitud.nombreMaquina}
                    </td>

                    <td>
                        ${solicitud.tipo_mantenimiento}
                    </td>

                    <td>
                        ${solicitud.prioridad}
                    </td>

                    <td>
                        ${solicitud.estado}
                    </td>

                    <td>
                        ${solicitud.numeroOrden
                            ? solicitud.numeroOrden
                            : "Pendiente"}
                    </td>

                </tr>
            `;

        });


        html += `
                </tbody>

            </table>
        `;


        listaSolicitudes.innerHTML = html;


    } catch (error) {

        console.error(
            "Error al consultar solicitudes:",
            error
        );

        listaSolicitudes.innerHTML =
            "<p>No se pudo conectar con el servidor.</p>";
    }
}


cargarSolicitudes();