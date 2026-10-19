const usuario = localStorage.getItem("usuario");
const rol = localStorage.getItem("rol");


if (!usuario || !rol) {

    window.location.href =
        "../index.html";

}


if (rol !== "tecnico") {

    window.location.href =
        "../index.html";

}


/* =====================================================
   OBTENER ID DE LA ORDEN
   ===================================================== */

const parametros =
    new URLSearchParams(
        window.location.search
    );


const idOrden =
    parametros.get("id");


if (!idOrden) {

    window.location.href =
        "ordenes-tecnico.html";

}


/* =====================================================
   ELEMENTOS
   ===================================================== */

const informacionOrden =
    document.getElementById(
        "informacionOrden"
    );


const diagnostico =
    document.getElementById(
        "diagnostico"
    );


const fechaInicio =
    document.getElementById(
        "fechaInicio"
    );


const fechaFin =
    document.getElementById(
        "fechaFin"
    );


const tiempoReparacion =
    document.getElementById(
        "tiempoReparacion"
    );


const estadoEquipo =
    document.getElementById(
        "estadoEquipo"
    );


const repuesto =
    document.getElementById(
        "repuesto"
    );


const cantidad =
    document.getElementById(
        "cantidad"
    );


const mensajeDiagnostico =
    document.getElementById(
        "mensajeDiagnostico"
    );


const mensajeTiempo =
    document.getElementById(
        "mensajeTiempo"
    );


const mensajeEstado =
    document.getElementById(
        "mensajeEstado"
    );


const mensajeRepuesto =
    document.getElementById(
        "mensajeRepuesto"
    );


const mensajeCerrar =
    document.getElementById(
        "mensajeCerrar"
    );


/* =====================================================
   CARGAR INFORMACIÓN DE LA ORDEN
   ===================================================== */

async function cargarOrden() {

    try {

        const respuesta =
            await fetch(
                `http://localhost:3000/api/tecnico/ordenes/${idOrden}?usuario=${encodeURIComponent(usuario)}`
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            informacionOrden.innerHTML = `
                <p>
                    ${datos.mensaje}
                </p>
            `;

            return;

        }


        const orden =
            datos.orden;


        informacionOrden.innerHTML = `

            <div class="resumen-secundario">

                <div class="tarjeta-secundaria">

                    <strong>
                        OT-${orden.numero_consecutivo}
                    </strong>

                    <span>
                        Orden
                    </span>

                </div>


                <div class="tarjeta-secundaria">

                    <strong>
                        ${orden.codigo_maquina}
                    </strong>

                    <span>
                        Máquina
                    </span>

                </div>


                <div class="tarjeta-secundaria">

                    <strong>
                        ${orden.prioridad}
                    </strong>

                    <span>
                        Prioridad
                    </span>

                </div>


                <div class="tarjeta-secundaria">

                    <strong>
                        ${orden.estado}
                    </strong>

                    <span>
                        Estado
                    </span>

                </div>

            </div>


            <div class="detalle-orden">

                <p>
                    <strong>
                        Máquina:
                    </strong>

                    ${orden.nombre_maquina}
                </p>


                <p>
                    <strong>
                        Ubicación:
                    </strong>

                    ${orden.ubicacion}
                </p>


                <p>
                    <strong>
                        Tipo de mantenimiento:
                    </strong>

                    ${orden.tipo_mantenimiento}
                </p>


                <p>
                    <strong>
                        Descripción de la falla:
                    </strong>

                    ${orden.descripcion_falla}
                </p>

            </div>

        `;


    } catch (error) {

        console.error(
            "Error al cargar la orden:",
            error
        );


        informacionOrden.innerHTML = `
            <p>
                No se pudo conectar con el servidor.
            </p>
        `;

    }

}


/* =====================================================
   CARGAR INTERVENCIÓN
   ===================================================== */

async function cargarIntervencion() {

    try {

        const respuesta =
            await fetch(
                `http://localhost:3000/api/tecnico/ordenes/${idOrden}/intervencion`
            );


        if (!respuesta.ok) {
            return;
        }


        const datos =
            await respuesta.json();


        const intervencion =
            datos.intervencion;


        if (!intervencion) {
            return;
        }


        if (
            diagnostico &&
            intervencion.diagnostico
        ) {

            diagnostico.value =
                intervencion.diagnostico;

        }


        if (
            fechaInicio &&
            intervencion.fecha_inicio
        ) {

            fechaInicio.value =
                convertirFechaInput(
                    intervencion.fecha_inicio
                );

        }


        if (
            fechaFin &&
            intervencion.fecha_fin
        ) {

            fechaFin.value =
                convertirFechaInput(
                    intervencion.fecha_fin
                );

        }


        if (
            tiempoReparacion &&
            intervencion.tiempo_reparacion !== null
        ) {

            tiempoReparacion.value =
                intervencion.tiempo_reparacion;

        }


        if (
            estadoEquipo &&
            intervencion.estado_equipo
        ) {

            estadoEquipo.value =
                intervencion.estado_equipo;

        }


    } catch (error) {

        console.error(
            "Error al cargar intervención:",
            error
        );

    }

}


/* =====================================================
   GUARDAR DIAGNÓSTICO
   ===================================================== */

async function guardarDiagnostico() {

    const valorDiagnostico =
        diagnostico.value.trim();


    if (!valorDiagnostico) {

        mensajeDiagnostico.textContent =
            "Debes ingresar el diagnóstico.";

        return;

    }


    try {

        const respuesta =
            await fetch(
                `http://localhost:3000/api/tecnico/ordenes/${idOrden}/diagnostico`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        diagnostico:
                            valorDiagnostico,

                        fechaInicio:
                            fechaInicio.value

                    })

                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            mensajeDiagnostico.textContent =
                datos.mensaje ||
                "Error al registrar diagnóstico.";

            return;

        }


        mensajeDiagnostico.textContent =
            "Diagnóstico registrado correctamente.";

        await cargarIntervencion();


    } catch (error) {

        console.error(
            "Error al registrar diagnóstico:",
            error
        );


        mensajeDiagnostico.textContent =
            "No se pudo conectar con el servidor.";

    }

}


/* =====================================================
   GUARDAR TIEMPO
   ===================================================== */

async function guardarTiempo() {

    if (
        !fechaInicio.value ||
        !fechaFin.value
    ) {

        mensajeTiempo.textContent =
            "Debes registrar la fecha de inicio y finalización.";

        return;

    }


    const inicio =
        new Date(fechaInicio.value);


    const fin =
        new Date(fechaFin.value);


    if (fin <= inicio) {

        mensajeTiempo.textContent =
            "La fecha de finalización debe ser posterior a la fecha de inicio.";

        return;

    }


    const diferencia =
        fin.getTime() -
        inicio.getTime();


    const minutos =
        Math.round(
            diferencia / 60000
        );


    const horas =
        (minutos / 60).toFixed(2);


    tiempoReparacion.value =
        horas;


    try {

        const respuesta =
            await fetch(
                `http://localhost:3000/api/tecnico/ordenes/${idOrden}/tiempo`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        fechaInicio:
                            fechaInicio.value,

                        fechaFin:
                            fechaFin.value,

                        tiempoReparacion:
                            horas

                    })

                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            mensajeTiempo.textContent =
                datos.mensaje ||
                "Error al registrar el tiempo.";

            return;

        }


        mensajeTiempo.textContent =
            "Tiempo de reparación registrado correctamente.";


    } catch (error) {

        console.error(
            "Error al registrar tiempo:",
            error
        );


        mensajeTiempo.textContent =
            "No se pudo conectar con el servidor.";

    }

}


/* =====================================================
   ACTUALIZAR ESTADO DE LA MÁQUINA
   ===================================================== */

async function guardarEstado() {

    if (!estadoEquipo.value) {

        mensajeEstado.textContent =
            "Debes seleccionar un estado.";

        return;

    }


    try {

        const respuesta =
            await fetch(
                `http://localhost:3000/api/tecnico/ordenes/${idOrden}/estado`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        estadoEquipo:
                            estadoEquipo.value

                    })

                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            mensajeEstado.textContent =
                datos.mensaje ||
                "Error al actualizar el estado.";

            return;

        }


        mensajeEstado.textContent =
            "Estado de la máquina actualizado correctamente.";


    } catch (error) {

        console.error(
            "Error al actualizar estado:",
            error
        );


        mensajeEstado.textContent =
            "No se pudo conectar con el servidor.";

    }

}


/* =====================================================
   CARGAR REPUESTOS
   ===================================================== */

async function cargarRepuestos() {

    try {

        const respuesta =
            await fetch(
                "http://localhost:3000/api/tecnico/repuestos"
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            console.error(
                "Error al consultar repuestos:",
                datos
            );

            return;
        }


        if (!repuesto) {
            return;
        }


        repuesto.innerHTML =
            '<option value="">Seleccione un repuesto</option>';


        // El backend puede devolver directamente
        // el arreglo o un objeto con la propiedad repuestos.
        const listaRepuestos =
            Array.isArray(datos)
                ? datos
                : datos.repuestos || [];


        listaRepuestos.forEach(
            function(item) {

                const opcion =
                    document.createElement(
                        "option"
                    );


                opcion.value =
                    item.id_repuesto;


                opcion.textContent =
                    `${item.codigo} - ${item.nombre} (${item.existencia} disponibles)`;


                repuesto.appendChild(
                    opcion
                );

            }
        );


    } catch (error) {

        console.error(
            "Error al cargar repuestos:",
            error
        );

    }

}


/* =====================================================
   REGISTRAR REPUESTO
   ===================================================== */

async function guardarRepuesto() {

    if (!repuesto.value) {

        mensajeRepuesto.textContent =
            "Debes seleccionar un repuesto.";

        return;

    }


    if (
        !cantidad.value ||
        Number(cantidad.value) <= 0
    ) {

        mensajeRepuesto.textContent =
            "Debes ingresar una cantidad válida.";

        return;

    }


    try {

        const respuesta =
            await fetch(
                `http://localhost:3000/api/tecnico/ordenes/${idOrden}/repuestos`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        idRepuesto:
                            repuesto.value,

                        cantidad:
                            Number(cantidad.value)

                    })

                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            mensajeRepuesto.textContent =
                datos.mensaje ||
                "Error al registrar repuesto.";

            return;

        }


        mensajeRepuesto.textContent =
            "Repuesto registrado correctamente.";


        cantidad.value = "";


        await cargarRepuestosOrden();

        await cargarRepuestos();


    } catch (error) {

        console.error(
            "Error al registrar repuesto:",
            error
        );


        mensajeRepuesto.textContent =
            "No se pudo conectar con el servidor.";

    }

}


/* =====================================================
   MOSTRAR REPUESTOS UTILIZADOS
   ===================================================== */

async function cargarRepuestosOrden() {

    const tablaRepuestos =
        document.getElementById(
            "listaRepuestos"
        );


    if (!tablaRepuestos) {
        return;
    }


    try {

        const respuesta =
            await fetch(
                `http://localhost:3000/api/tecnico/ordenes/${idOrden}/repuestos`
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {
            return;
        }


        const repuestos =
            datos.repuestos || [];


        if (repuestos.length === 0) {

            tablaRepuestos.innerHTML = `
                <tr>
                    <td colspan="4">
                        No se han registrado repuestos.
                    </td>
                </tr>
            `;

            return;

        }


        tablaRepuestos.innerHTML = "";


        repuestos.forEach(
            function(item) {

                const fila =
                    document.createElement(
                        "tr"
                    );


                fila.innerHTML = `

                    <td>
                        ${item.codigo}
                    </td>

                    <td>
                        ${item.nombre}
                    </td>

                    <td>
                        ${item.cantidad}
                    </td>

                    <td>
                        $${item.costo_unitario}
                    </td>

                `;


                tablaRepuestos.appendChild(
                    fila
                );

            }
        );


    } catch (error) {

        console.error(
            "Error al cargar repuestos registrados:",
            error
        );

    }

}


/* =====================================================
   CERRAR ORDEN
   ===================================================== */

async function cerrarOrden() {

    try {

        const respuesta =
            await fetch(
                `http://localhost:3000/api/tecnico/ordenes/${idOrden}/cerrar`,
                {
                    method: "PATCH"
                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            mensajeCerrar.textContent =
                datos.mensaje ||
                "No se pudo cerrar la orden.";

            return;

        }


        mensajeCerrar.textContent =
            datos.mensaje ||
            "Orden cerrada correctamente.";


        await cargarOrden();


    } catch (error) {

        console.error(
            "Error al cerrar orden:",
            error
        );


        mensajeCerrar.textContent =
            "No se pudo conectar con el servidor.";

    }

}


/* =====================================================
   CONVERTIR FECHA PARA INPUT DATETIME-LOCAL
   ===================================================== */

function convertirFechaInput(fecha) {

    if (!fecha) {
        return "";
    }


    const fechaObjeto =
        new Date(fecha);


    const año =
        fechaObjeto.getFullYear();


    const mes =
        String(
            fechaObjeto.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            fechaObjeto.getDate()
        ).padStart(2, "0");


    const horas =
        String(
            fechaObjeto.getHours()
        ).padStart(2, "0");


    const minutos =
        String(
            fechaObjeto.getMinutes()
        ).padStart(2, "0");


    return `${año}-${mes}-${dia}T${horas}:${minutos}`;

}


/* =====================================================
   EVENTOS
   ===================================================== */

const botonDiagnostico =
    document.getElementById(
        "guardarDiagnostico"
    );

if (botonDiagnostico) {

    botonDiagnostico.addEventListener(
        "click",
        guardarDiagnostico
    );

}


const botonTiempo =
    document.getElementById(
        "guardarTiempo"
    );

if (botonTiempo) {

    botonTiempo.addEventListener(
        "click",
        guardarTiempo
    );

}


const botonEstado =
    document.getElementById(
        "guardarEstado"
    );

if (botonEstado) {

    botonEstado.addEventListener(
        "click",
        guardarEstado
    );

}


const botonRepuesto =
    document.getElementById(
        "guardarRepuesto"
    );

if (botonRepuesto) {

    botonRepuesto.addEventListener(
        "click",
        guardarRepuesto
    );

}


const botonCerrar =
    document.getElementById(
        "cerrarOrden"
    );

if (botonCerrar) {

    botonCerrar.addEventListener(
        "click",
        cerrarOrden
    );

}


/* =====================================================
   INICIAR
   ===================================================== */

cargarOrden();
cargarIntervencion();
cargarRepuestos();
cargarRepuestosOrden();