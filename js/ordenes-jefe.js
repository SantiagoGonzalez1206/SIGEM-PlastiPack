const listaOrdenes =
    document.getElementById(
        "listaOrdenes"
    );


const listaSolicitudesPendientes =
    document.getElementById(
        "listaSolicitudesPendientes"
    );


function obtenerTextoPrioridad(
    prioridad
) {

    if (prioridad === "Alta") {

        return "Alta";

    }


    if (prioridad === "Media") {

        return "Media";

    }


    return "Baja";
}


function obtenerTextoEstado(
    estado
) {

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


/* ==========================================
   RF-03
   CARGAR SOLICITUDES
========================================== */

async function cargarSolicitudesPendientes() {

    try {

        const respuesta =
            await fetch(
                "http://localhost:3000/api/jefe/solicitudes/pendientes"
            );


        const solicitudes =
            await respuesta.json();


        if (!respuesta.ok) {

            listaSolicitudesPendientes.innerHTML = `

                <tr>

                    <td colspan="7">

                        No se pudieron consultar
                        las solicitudes.

                    </td>

                </tr>

            `;

            return;

        }


        listaSolicitudesPendientes.innerHTML =
            "";


        if (
            solicitudes.length === 0
        ) {

            listaSolicitudesPendientes.innerHTML = `

                <tr>

                    <td colspan="7">

                        No hay solicitudes pendientes
                        de validación.

                    </td>

                </tr>

            `;

            return;

        }


        solicitudes.forEach(
            function(solicitud) {

                const fila =
                    document.createElement(
                        "tr"
                    );


                fila.innerHTML = `

                    <td>

                        SOL-${String(
                            solicitud.id_solicitud
                        ).padStart(3, "0")}

                        <span class="texto-secundario">

                            ${solicitud.usuario}

                        </span>

                    </td>


                    <td>

                        ${solicitud.codigo_maquina}

                        <span class="texto-secundario">

                            ${solicitud.nombre_maquina}

                        </span>

                    </td>


                    <td>

                        ${solicitud.tipo_mantenimiento}

                    </td>


                    <td>

                        ${solicitud.descripcion_falla}

                    </td>


                    <td>

                        ${solicitud.criticidad}

                    </td>


                    <td>

                        ${obtenerTextoPrioridad(
                            solicitud.prioridad
                        )}

                    </td>


                    <td>

                        <div class="acciones-tabla">

                            <button
                                type="button"
                                class="boton-principal"
                                onclick="validarSolicitud(
                                    ${solicitud.id_solicitud}
                                )"
                            >

                                Validar

                            </button>

                        </div>

                    </td>

                `;


                listaSolicitudesPendientes.appendChild(
                    fila
                );

            }
        );


    } catch (error) {

        console.error(
            "Error al cargar solicitudes:",
            error
        );


        listaSolicitudesPendientes.innerHTML = `

            <tr>

                <td colspan="7">

                    No se pudo conectar con el servidor.

                </td>

            </tr>

        `;

    }

}


/* ==========================================
   RF-03 + RF-04 + RF-05
   VALIDAR
========================================== */

async function validarSolicitud(
    idSolicitud
) {

    const confirmar =
        confirm(
            "¿Confirmas que la información de esta solicitud es suficiente para continuar?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                `http://localhost:3000/api/jefe/solicitudes/${idSolicitud}/validar`,
                {
                    method: "PATCH"
                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            alert(
                datos.mensaje
            );

            return;

        }


        alert(

            datos.mensaje +

            "\n\nPrioridad determinada: " +
            datos.prioridad +

            "\nOT generada: OT-" +
            datos.numeroOrden

        );


        await cargarSolicitudesPendientes();

        await cargarOrdenes();


    } catch (error) {

        console.error(
            "Error al validar solicitud:",
            error
        );


        alert(
            "No se pudo conectar con el servidor."
        );

    }

}


/* ==========================================
   CARGAR ÓRDENES
========================================== */

async function cargarOrdenes() {

    try {

        const respuesta =
            await fetch(
                "http://localhost:3000/api/jefe/ordenes"
            );


        const ordenes =
            await respuesta.json();


        if (!respuesta.ok) {

            listaOrdenes.innerHTML = `

                <tr>

                    <td colspan="7">

                        No se pudieron consultar
                        las órdenes.

                    </td>

                </tr>

            `;

            return;

        }


        listaOrdenes.innerHTML =
            "";


        if (
            ordenes.length === 0
        ) {

            listaOrdenes.innerHTML = `

                <tr>

                    <td colspan="7">

                        No hay órdenes de trabajo registradas.

                    </td>

                </tr>

            `;

            return;

        }


        ordenes.forEach(
            function(orden) {

                const fila =
                    document.createElement(
                        "tr"
                    );


                const tecnico =
                    orden.nombre_tecnico ||
                    "Sin asignar";


                let acciones = "";


                if (
                    orden.estado ===
                    "Pendiente"
                ) {

                    acciones = `

                        <div class="acciones-tabla">

                            <button
                                type="button"
                                class="boton-secundario"
                                onclick="cancelarOrden(
                                    ${orden.id_orden}
                                )"
                            >

                                Cancelar

                            </button>

                        </div>

                    `;

                }


                fila.innerHTML = `

                    <td>

                        OT-${orden.numero_consecutivo}

                    </td>


                    <td>

                        SOL-${String(
                            orden.id_solicitud
                        ).padStart(3, "0")}

                    </td>


                    <td>

                        ${orden.codigo_maquina}

                        <span class="texto-secundario">

                            ${orden.nombre_maquina}

                        </span>

                    </td>


                    <td>

                        ${obtenerTextoPrioridad(
                            orden.prioridad
                        )}

                    </td>


                    <td>

                        ${tecnico}

                    </td>


                    <td>

                        ${obtenerTextoEstado(
                            orden.estado
                        )}

                    </td>


                    <td>

                        ${acciones}

                    </td>

                `;


                listaOrdenes.appendChild(
                    fila
                );

            }
        );


    } catch (error) {

        console.error(
            "Error al cargar órdenes:",
            error
        );


        listaOrdenes.innerHTML = `

            <tr>

                <td colspan="7">

                    No se pudo conectar
                    con el servidor.

                </td>

            </tr>

        `;

    }

}


/* ==========================================
   CANCELAR OT
========================================== */

async function cancelarOrden(
    idOrden
) {

    const confirmar =
        confirm(
            "¿Estás seguro de cancelar esta orden de trabajo?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                `http://localhost:3000/api/jefe/ordenes/${idOrden}/cancelar`,
                {
                    method: "PATCH"
                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            alert(
                datos.mensaje
            );

            return;

        }


        alert(
            datos.mensaje
        );


        await cargarOrdenes();


    } catch (error) {

        console.error(
            "Error al cancelar la orden:",
            error
        );


        alert(
            "No se pudo conectar con el servidor."
        );

    }

}


/* ==========================================
   INICIO
========================================== */

cargarSolicitudesPendientes();

cargarOrdenes();