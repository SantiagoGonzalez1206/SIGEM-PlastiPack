const usuario =
    localStorage.getItem("usuario");

const rol =
    localStorage.getItem("rol");


/* =====================================================
   VALIDACIÓN DE SESIÓN
   ===================================================== */

if (!usuario || !rol) {

    window.location.href =
        "../index.html";

}


if (rol !== "tecnico") {

    window.location.href =
        "../index.html";

}


/* =====================================================
   MOSTRAR USUARIO
   ===================================================== */

const usuarioSesion =
    document.getElementById(
        "usuarioSesion"
    );


if (usuarioSesion) {

    usuarioSesion.textContent =
        usuario;

}


/* =====================================================
   TABLA
   ===================================================== */

const listaOrdenes =
    document.getElementById(
        "listaOrdenes"
    );


/* =====================================================
   CARGAR ÓRDENES
   ===================================================== */

async function cargarOrdenes() {

    try {

        const respuesta =
            await fetch(
                `http://localhost:3000/api/tecnico/ordenes?usuario=${encodeURIComponent(usuario)}`
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            console.error(
                "Error al consultar las órdenes:",
                datos
            );


            listaOrdenes.innerHTML = `

                <tr>

                    <td colspan="5">

                        No se pudieron consultar las órdenes.

                    </td>

                </tr>

            `;

            return;

        }


        /*
         * El backend devuelve directamente
         * un arreglo.
         */

        const ordenes =
            Array.isArray(datos)
                ? datos
                : (datos.ordenes || []);


        /* =================================================
           SIN ÓRDENES
           ================================================= */

        if (ordenes.length === 0) {

            listaOrdenes.innerHTML = `

                <tr>

                    <td colspan="5">

                        No tienes órdenes de trabajo asignadas.

                    </td>

                </tr>

            `;

            return;

        }


        /* =================================================
           GENERAR TABLA
           ================================================= */

        listaOrdenes.innerHTML = "";


        ordenes.forEach(function(orden) {


            let claseEstado =
                "estado-tabla-tecnico";


            if (orden.estado === "Pendiente") {

                claseEstado +=
                    " estado-pendiente";

            }


            if (orden.estado === "En proceso") {

                claseEstado +=
                    " estado-proceso";

            }


            if (orden.estado === "Cerrada") {

                claseEstado +=
                    " estado-cerrada";

            }


            let clasePrioridad =
                "prioridad-tabla-tecnico";


            if (orden.prioridad === "Alta") {

                clasePrioridad +=
                    " prioridad-alta";

            }


            if (orden.prioridad === "Media") {

                clasePrioridad +=
                    " prioridad-media";

            }


            if (orden.prioridad === "Baja") {

                clasePrioridad +=
                    " prioridad-baja";

            }


            const fila =
                document.createElement("tr");


            fila.innerHTML = `

                <td>

                    <strong>
                        OT-${orden.numero_consecutivo}
                    </strong>

                </td>


                <td>

                    <strong>
                        ${orden.codigo_maquina}
                    </strong>

                    <span class="texto-secundario-tecnico">

                        ${orden.nombre_maquina}

                    </span>

                </td>


                <td>

                    <span class="${clasePrioridad}">

                        ${orden.prioridad}

                    </span>

                </td>


                <td>

                    <span class="${claseEstado}">

                        ${orden.estado}

                    </span>

                </td>


                <td>

                    <a
                        href="gestion-orden-tecnico.html?id=${orden.id_orden}"
                        class="boton-gestionar-tecnico"
                    >

                        Gestionar

                    </a>

                </td>

            `;


            listaOrdenes.appendChild(
                fila
            );

        });


    } catch (error) {

        console.error(
            "Error al cargar órdenes:",
            error
        );


        listaOrdenes.innerHTML = `

            <tr>

                <td colspan="5">

                    No se pudo conectar con el servidor.

                </td>

            </tr>

        `;

    }

}


/* =====================================================
   INICIAR
   ===================================================== */

cargarOrdenes();