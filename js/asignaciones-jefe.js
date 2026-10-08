const orden = document.getElementById("orden");
const tecnico = document.getElementById("tecnico");
const formularioAsignacion =
    document.getElementById("formularioAsignacion");
const mensajeAsignacion =
    document.getElementById("mensajeAsignacion");
const listaAsignaciones =
    document.getElementById("listaAsignaciones");


async function cargarOrdenes() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/jefe/ordenes/pendientes"
        );

        const ordenes = await respuesta.json();

        orden.innerHTML = `
            <option value="">
                Selecciona una orden
            </option>
        `;

        ordenes.forEach(function(item) {

            const opcion = document.createElement("option");

            opcion.value = item.id_orden;

            opcion.textContent =
                `OT-${item.numero_consecutivo} - ${item.codigo_maquina}`;

            orden.appendChild(opcion);

        });

    } catch (error) {

        console.error(
            "Error al cargar órdenes:",
            error
        );
    }
}


async function cargarTecnicos() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/tecnicos"
        );

        const tecnicos = await respuesta.json();

        tecnico.innerHTML = `
            <option value="">
                Selecciona un técnico
            </option>
        `;

        tecnicos.forEach(function(item) {

            const opcion = document.createElement("option");

            opcion.value = item.id_usuario;

            opcion.textContent = item.nombre;

            tecnico.appendChild(opcion);

        });

    } catch (error) {

        console.error(
            "Error al cargar técnicos:",
            error
        );
    }
}


async function cargarAsignaciones() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/jefe/ordenes"
        );

        const ordenes = await respuesta.json();

        listaAsignaciones.innerHTML = "";

        if (ordenes.length === 0) {

            listaAsignaciones.innerHTML = `
                <tr>
                    <td colspan="5">
                        No hay órdenes registradas.
                    </td>
                </tr>
            `;

            return;
        }

        ordenes.forEach(function(item) {

            const fila = document.createElement("tr");

            const tecnicoAsignado =
                item.nombre_tecnico || "Sin asignar";

            fila.innerHTML = `
                <td>
                    OT-${item.numero_consecutivo}
                </td>

                <td>
                    ${item.codigo_maquina}
                    <span class="texto-secundario">
                        ${item.nombre_maquina}
                    </span>
                </td>

                <td>
                    ${item.prioridad}
                </td>

                <td>
                    ${tecnicoAsignado}
                </td>

                <td>
                    ${item.estado}
                </td>
            `;

            listaAsignaciones.appendChild(fila);

        });

    } catch (error) {

        console.error(
            "Error al cargar asignaciones:",
            error
        );
    }
}


formularioAsignacion.addEventListener(
    "submit",
    async function(evento) {

        evento.preventDefault();

        if (orden.value === "" || tecnico.value === "") {

            mensajeAsignacion.textContent =
                "Selecciona una orden y un técnico.";

            mensajeAsignacion.style.color = "red";

            return;
        }

        try {

            const respuesta = await fetch(
                "http://localhost:3000/api/jefe/ordenes/asignar",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        idOrden: orden.value,
                        idTecnico: tecnico.value
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {

                mensajeAsignacion.textContent =
                    datos.mensaje;

                mensajeAsignacion.style.color = "red";

                return;
            }

            mensajeAsignacion.textContent =
                datos.mensaje;

            mensajeAsignacion.style.color = "green";

            formularioAsignacion.reset();

            await cargarOrdenes();
            await cargarAsignaciones();

        } catch (error) {

            mensajeAsignacion.textContent =
                "No se pudo conectar con el servidor.";

            mensajeAsignacion.style.color = "red";

            console.error(
                "Error al asignar técnico:",
                error
            );
        }
    }
);


cargarOrdenes();
cargarTecnicos();
cargarAsignaciones();