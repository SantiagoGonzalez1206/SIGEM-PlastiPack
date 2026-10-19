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
   ELEMENTOS DEL DASHBOARD
   ===================================================== */

const totalOrdenes =
    document.getElementById(
        "totalOrdenes"
    );


const ordenesPendientes =
    document.getElementById(
        "ordenesPendientes"
    );


const ordenesEnProceso =
    document.getElementById(
        "ordenesEnProceso"
    );


const ordenesCerradas =
    document.getElementById(
        "ordenesCerradas"
    );


const mensajeResumen =
    document.getElementById(
        "mensajeResumenTecnico"
    );


/* =====================================================
   CARGAR RESUMEN
   ===================================================== */

async function cargarResumen() {

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

            if (mensajeResumen) {

                mensajeResumen.textContent =
                    "No se pudo consultar la información.";

            }

            return;

        }


        /*
         * El backend devuelve directamente
         * un arreglo de órdenes.
         */

        const ordenes =
            Array.isArray(datos)
                ? datos
                : (datos.ordenes || []);


        /* =================================================
           CONTAR ESTADOS
           ================================================= */

        const pendientes =
            ordenes.filter(function(orden) {

                return orden.estado === "Pendiente";

            }).length;


        const enProceso =
            ordenes.filter(function(orden) {

                return orden.estado === "En proceso";

            }).length;


        const cerradas =
            ordenes.filter(function(orden) {

                return orden.estado === "Cerrada";

            }).length;


        /* =================================================
           MOSTRAR INDICADORES
           ================================================= */

        if (totalOrdenes) {

            totalOrdenes.textContent =
                ordenes.length;

        }


        if (ordenesPendientes) {

            ordenesPendientes.textContent =
                pendientes;

        }


        if (ordenesEnProceso) {

            ordenesEnProceso.textContent =
                enProceso;

        }


        if (ordenesCerradas) {

            ordenesCerradas.textContent =
                cerradas;

        }


        /* =================================================
           MENSAJE GENERAL
           ================================================= */

        if (mensajeResumen) {

            if (pendientes > 0) {

                mensajeResumen.textContent =
                    `Tienes ${pendientes} orden${pendientes === 1 ? "" : "es"} pendiente${pendientes === 1 ? "" : "s"} de atención.`;

            } else if (enProceso > 0) {

                mensajeResumen.textContent =
                    `Actualmente tienes ${enProceso} orden${enProceso === 1 ? "" : "es"} en proceso de reparación.`;

            } else if (ordenes.length === 0) {

                mensajeResumen.textContent =
                    "No tienes órdenes de trabajo asignadas actualmente.";

            } else {

                mensajeResumen.textContent =
                    "No tienes órdenes pendientes de atención.";

            }

        }


    } catch (error) {

        console.error(
            "Error al cargar resumen del Técnico:",
            error
        );


        if (mensajeResumen) {

            mensajeResumen.textContent =
                "No se pudo conectar con el servidor.";

        }

    }

}


/* =====================================================
   INICIAR
   ===================================================== */

cargarResumen();