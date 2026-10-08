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
                        <th>Fecha</th>
                        <th>Máquina</th>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Prioridad</th>
                        <th>Estado</th>
                        <th>OT</th>
                    </tr>

                </thead>

                <tbody>
        `;


        solicitudes.forEach(function(solicitud) {

    const fecha = new Date(solicitud.fecha_hora);

    const fechaFormateada = fecha.toLocaleDateString("es-CO");
    const horaFormateada = fecha.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const estadoClase = solicitud.estado
        .toLowerCase()
        .replaceAll(" ", "-");

    const prioridadClase = solicitud.prioridad
        .toLowerCase();

    html += `
        <tr>

            <td>#${solicitud.id_solicitud}</td>

            <td>
                ${fechaFormateada}<br>
                <span class="hora-reporte">
                    ${horaFormateada}
                </span>
            </td>

            <td>
                <strong>${solicitud.codigoMaquina}</strong><br>
                <span class="texto-secundario">
                    ${solicitud.nombreMaquina}
                </span>
            </td>

            <td>
                ${solicitud.tipo_mantenimiento}
            </td>

            <td class="descripcion-reporte">
                ${solicitud.descripcion_falla}
            </td>

            <td>
                <span class="etiqueta-prioridad ${prioridadClase}">
                    ${solicitud.prioridad}
                </span>
            </td>

            <td>
                <span class="etiqueta-estado ${estadoClase}">
                    ${solicitud.estado}
                </span>
            </td>

            <td>
                ${
                    solicitud.numeroOrden
                        ? `OT-${solicitud.numeroOrden}`
                        : "Pendiente"
                }
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