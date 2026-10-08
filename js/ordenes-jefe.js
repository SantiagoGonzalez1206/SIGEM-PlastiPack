const listaOrdenes = document.getElementById("listaOrdenes");


function obtenerTextoPrioridad(prioridad) {

    if (prioridad === "Alta") {
        return "Alta";
    }

    if (prioridad === "Media") {
        return "Media";
    }

    return "Baja";
}


function obtenerTextoEstado(estado) {

    if (estado === "Pendiente") {
        return "Pendiente";
    }

    if (estado === "En proceso") {
        return "En reparación";
    }

    if (estado === "Cerrada") {
        return "Finalizada";
    }

    return estado;
}


async function cargarOrdenes() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/jefe/ordenes"
        );

        const ordenes = await respuesta.json();

        if (!respuesta.ok) {

            listaOrdenes.innerHTML = `
                <tr>
                    <td colspan="6">
                        No se pudieron consultar las órdenes.
                    </td>
                </tr>
            `;

            return;
        }


        listaOrdenes.innerHTML = "";


        if (ordenes.length === 0) {

            listaOrdenes.innerHTML = `
                <tr>
                    <td colspan="6">
                        No hay órdenes de trabajo registradas.
                    </td>
                </tr>
            `;

            return;
        }


        ordenes.forEach(function(orden) {

            const fila = document.createElement("tr");

            const tecnico =
                orden.nombre_tecnico || "Sin asignar";


            fila.innerHTML = `
                <td>
                    OT-${orden.numero_consecutivo}
                </td>

                <td>
                    SOL-${String(orden.id_solicitud).padStart(3, "0")}
                </td>

                <td>
                    ${orden.codigo_maquina}
                    <span class="texto-secundario">
                        ${orden.nombre_maquina}
                    </span>
                </td>

                <td>
                    ${obtenerTextoPrioridad(orden.prioridad)}
                </td>

                <td>
                    ${tecnico}
                </td>

                <td>
                    ${obtenerTextoEstado(orden.estado)}
                </td>
            `;

            listaOrdenes.appendChild(fila);

        });


    } catch (error) {

        console.error(
            "Error al cargar órdenes:",
            error
        );

        listaOrdenes.innerHTML = `
            <tr>
                <td colspan="6">
                    No se pudo conectar con el servidor.
                </td>
            </tr>
        `;
    }
}


cargarOrdenes();