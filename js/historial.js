const usuario =
    localStorage.getItem("usuario");

const rol =
    localStorage.getItem("rol");


const rolesPermitidos = [
    "tecnico",
    "jefe",
    "gerente"
];


if (!usuario || !rol) {

    window.location.href =
        "../index.html";

}


if (!rolesPermitidos.includes(rol)) {

    window.location.href =
        "../index.html";

}


document.getElementById(
    "usuarioSesion"
).textContent = usuario;


/* ==========================================
   MENÚ
========================================== */

const menuPrincipal =
    document.getElementById(
        "menuPrincipal"
    );


if (rol === "tecnico") {

    menuPrincipal.innerHTML = `

        <a href="tecnico.html">

            <span class="menu-icono">
                ⌂
            </span>

            Inicio

        </a>


        <a href="ordenes-tecnico.html">

            <span class="menu-icono">
                ☷
            </span>

            Mis órdenes

        </a>


        <a
            href="historial.html"
            class="menu-activo"
        >

            <span class="menu-icono">
                ◫
            </span>

            Historial

        </a>


        <a
            href="#"
            id="cerrarSesion"
        >

            <span class="menu-icono">
                ↪
            </span>

            Cerrar sesión

        </a>

    `;

}


if (rol === "jefe") {

    menuPrincipal.innerHTML = `

        <a href="jefe.html">

            <span class="menu-icono">
                ⌂
            </span>

            Inicio

        </a>


        <a href="ordenes-jefe.html">

            <span class="menu-icono">
                ☷
            </span>

            Órdenes

        </a>


        <a href="asignaciones-jefe.html">

            <span class="menu-icono">
                ⇄
            </span>

            Asignaciones

        </a>


        <a href="preventivos-jefe.html">

            <span class="menu-icono">
                ◷
            </span>

            Preventivos

        </a>


        <a
            href="historial.html"
            class="menu-activo"
        >

            <span class="menu-icono">
                ◫
            </span>

            Historial

        </a>


        <a
            href="#"
            id="cerrarSesion"
        >

            <span class="menu-icono">
                ↪
            </span>

            Cerrar sesión

        </a>

    `;

}


if (rol === "gerente") {

    menuPrincipal.innerHTML = `

        <a href="gerente.html">

            <span class="menu-icono">
                ⌂
            </span>

            Inicio

        </a>


        <a href="historial.html"
           class="menu-activo">

            <span class="menu-icono">
                ◫
            </span>

            Historial

        </a>


        <a
            href="#"
            id="cerrarSesion"
        >

            <span class="menu-icono">
                ↪
            </span>

            Cerrar sesión

        </a>

    `;

}


/* ==========================================
   ELEMENTOS
========================================== */

const maquina =
    document.getElementById(
        "maquina"
    );

const btnConsultar =
    document.getElementById(
        "btnConsultar"
    );

const mensajeHistorial =
    document.getElementById(
        "mensajeHistorial"
    );

const informacionMaquina =
    document.getElementById(
        "informacionMaquina"
    );

const seccionHistorial =
    document.getElementById(
        "seccionHistorial"
    );

const seccionRepuestos =
    document.getElementById(
        "seccionRepuestos"
    );

const tablaHistorial =
    document.getElementById(
        "tablaHistorial"
    );

const tablaRepuestos =
    document.getElementById(
        "tablaRepuestos"
    );


/* ==========================================
   CARGAR MÁQUINAS
========================================== */

async function cargarMaquinas() {

    try {

        const respuesta =
            await fetch(
                "http://localhost:3000/api/historial/maquinas"
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datos.mensaje ||
                "No se pudieron consultar las máquinas."
            );

        }


        const maquinas =
            Array.isArray(datos)
                ? datos
                : datos.maquinas || [];


        maquina.innerHTML = `
            <option value="">
                Seleccione una máquina
            </option>
        `;


        maquinas.forEach(
            function(item) {

                const opcion =
                    document.createElement(
                        "option"
                    );


                opcion.value =
                    item.id_maquina;


                opcion.textContent =
                    `${item.codigo} - ${item.nombre}`;


                maquina.appendChild(
                    opcion
                );

            }
        );


    } catch (error) {

        console.error(
            "Error al cargar máquinas:",
            error
        );


        mensajeHistorial.textContent =
            "No se pudieron cargar las máquinas.";

        mensajeHistorial.className =
            "mensaje-formulario mensaje-error";

    }

}


/* ==========================================
   CONSULTAR HISTORIAL
========================================== */

async function consultarHistorial() {

    const idMaquina =
        maquina.value;


    if (!idMaquina) {

        mensajeHistorial.textContent =
            "Seleccione una máquina.";

        mensajeHistorial.className =
            "mensaje-formulario mensaje-error";

        return;

    }


    mensajeHistorial.textContent =
        "Consultando historial...";

    mensajeHistorial.className =
        "mensaje-formulario";


    btnConsultar.disabled = true;


    try {

        const respuesta =
            await fetch(
                `http://localhost:3000/api/historial/maquinas/${idMaquina}`
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datos.mensaje ||
                "No se pudo consultar el historial."
            );

        }


        const maquinaDatos =
            datos.maquina || datos;


        const historial =
            datos.historial || [];


        const repuestos =
            datos.repuestos || [];


        mostrarInformacionMaquina(
            maquinaDatos
        );


        mostrarHistorial(
            historial
        );


        mostrarRepuestos(
            repuestos
        );


        informacionMaquina.style.display =
            "block";


        seccionHistorial.style.display =
            "block";


        seccionRepuestos.style.display =
            "block";


        mensajeHistorial.textContent =
            "Historial consultado correctamente.";

        mensajeHistorial.className =
            "mensaje-formulario mensaje-exito";


    } catch (error) {

        console.error(
            "Error al consultar historial:",
            error
        );


        mensajeHistorial.textContent =
            error.message ||
            "No se pudo consultar el historial.";

        mensajeHistorial.className =
            "mensaje-formulario mensaje-error";


        informacionMaquina.style.display =
            "none";


        seccionHistorial.style.display =
            "none";


        seccionRepuestos.style.display =
            "none";

    } finally {

        btnConsultar.disabled =
            false;

    }

}


/* ==========================================
   INFORMACIÓN DE MÁQUINA
========================================== */

function mostrarInformacionMaquina(
    datos
) {

    document.getElementById(
        "codigoMaquina"
    ).textContent =
        datos.codigo || "-";


    document.getElementById(
        "nombreMaquina"
    ).textContent =
        datos.nombre || "-";


    document.getElementById(
        "ubicacionMaquina"
    ).textContent =
        datos.ubicacion || "-";


    document.getElementById(
        "estadoMaquina"
    ).textContent =
        datos.estado || "-";

}


/* ==========================================
   HISTORIAL
========================================== */

function mostrarHistorial(
    historial
) {

    tablaHistorial.innerHTML =
        "";


    if (
        !historial ||
        historial.length === 0
    ) {

        tablaHistorial.innerHTML = `

            <tr>

                <td colspan="6">

                    No hay intervenciones registradas
                    para esta máquina.

                </td>

            </tr>

        `;

        return;

    }


    historial.forEach(
        function(item) {

            const fila =
                document.createElement(
                    "tr"
                );


            fila.innerHTML = `

                <td>
                    OT-${item.numero_consecutivo}
                </td>

                <td>
                    ${formatearFecha(
                        item.fecha_hora ||
                        item.fecha_cierre
                    )}
                </td>

                <td>
                    ${item.tipo_mantenimiento || "-"}
                </td>

                <td>
                    ${item.prioridad || "-"}
                </td>

                <td>
                    ${item.diagnostico || "Sin diagnóstico"}
                </td>

                <td>
                    ${item.tiempo_reparacion || "-"}
                </td>

            `;


            tablaHistorial.appendChild(
                fila
            );

        }
    );

}


/* ==========================================
   REPUESTOS
========================================== */

function mostrarRepuestos(
    repuestos
) {

    tablaRepuestos.innerHTML =
        "";


    if (
        !repuestos ||
        repuestos.length === 0
    ) {

        tablaRepuestos.innerHTML = `

            <tr>

                <td colspan="5">

                    No se han registrado repuestos
                    para esta máquina.

                </td>

            </tr>

        `;

        return;

    }


    repuestos.forEach(
        function(item) {

            const fila =
                document.createElement(
                    "tr"
                );


            fila.innerHTML = `

                <td>
                    OT-${item.numero_consecutivo}
                </td>

                <td>
                    ${item.codigo || "-"}
                </td>

                <td>
                    ${item.nombre || "-"}
                </td>

                <td>
                    ${item.cantidad || 0}
                </td>

                <td>
                    ${formatearCosto(
                        item.costo_unitario
                    )}
                </td>

            `;


            tablaRepuestos.appendChild(
                fila
            );

        }
    );

}


/* ==========================================
   FORMATO DE FECHA
========================================== */

function formatearFecha(
    fecha
) {

    if (!fecha) {

        return "-";

    }


    const fechaObjeto =
        new Date(fecha);


    if (
        Number.isNaN(
            fechaObjeto.getTime()
        )
    ) {

        return fecha;

    }


    return fechaObjeto.toLocaleString(
        "es-CO",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    );

}


/* ==========================================
   FORMATO DE COSTO
========================================== */

function formatearCosto(
    costo
) {

    if (
        costo === null ||
        costo === undefined
    ) {

        return "-";

    }


    return Number(costo).toLocaleString(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    );

}


/* ==========================================
   CERRAR SESIÓN
========================================== */

document.addEventListener(
    "click",
    function(evento) {

        if (
            evento.target.closest(
                "#cerrarSesion"
            )
        ) {

            evento.preventDefault();

            localStorage.clear();

            window.location.href =
                "../index.html";

        }

    }
);


/* ==========================================
   EVENTOS
========================================== */

btnConsultar.addEventListener(
    "click",
    consultarHistorial
);


/* ==========================================
   INICIO
========================================== */

cargarMaquinas();