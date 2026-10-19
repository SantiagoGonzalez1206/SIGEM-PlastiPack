const usuario =
    localStorage.getItem("usuario");

const rol =
    localStorage.getItem("rol");


if (!usuario || !rol) {

    window.location.href =
        "../index.html";

}


if (rol !== "gerente") {

    window.location.href =
        "../index.html";

}


const usuarioSesion =
    document.getElementById(
        "usuarioSesion"
    );


if (usuarioSesion) {

    usuarioSesion.textContent =
        usuario;

}



function formatearFecha(fecha) {

    if (!fecha) {

        return "Sin registro";

    }


    return new Date(fecha)
        .toLocaleString(
            "es-CO"
        );

}



function formatearMoneda(valor) {

    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP"
        }
    ).format(
        Number(valor || 0)
    );

}



/* =====================================================
   MANTENIMIENTOS
   ===================================================== */

function mostrarMantenimientos(
    mantenimientos
) {

    const tabla =
        document.getElementById(
            "tablaMantenimientos"
        );


    if (
        !mantenimientos ||
        mantenimientos.length === 0
    ) {

        tabla.innerHTML = `
            <tr>
                <td colspan="6">
                    No hay mantenimientos registrados.
                </td>
            </tr>
        `;

        return;

    }


    tabla.innerHTML = "";


    mantenimientos.forEach(
        function(item) {

            tabla.innerHTML += `

                <tr>

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
                        ${item.tipo_mantenimiento}
                    </td>

                    <td>
                        ${item.prioridad}
                    </td>

                    <td>
                        ${item.nombre_tecnico || "Sin técnico"}
                    </td>

                    <td>
                        ${formatearFecha(
                            item.fecha_cierre
                        )}
                    </td>

                </tr>

            `;

        }
    );

}



/* =====================================================
   REPUESTOS
   ===================================================== */

function mostrarRepuestos(
    repuestos
) {

    const tabla =
        document.getElementById(
            "tablaRepuestos"
        );


    if (
        !repuestos ||
        repuestos.length === 0
    ) {

        tabla.innerHTML = `
            <tr>
                <td colspan="4">
                    No hay repuestos registrados.
                </td>
            </tr>
        `;

        return;

    }


    tabla.innerHTML = "";


    repuestos.forEach(
        function(item) {

            tabla.innerHTML += `

                <tr>

                    <td>
                        ${item.codigo}
                    </td>

                    <td>
                        ${item.nombre}
                    </td>

                    <td>
                        ${item.cantidad_total}
                    </td>

                    <td>
                        ${formatearMoneda(
                            item.costo_total
                        )}
                    </td>

                </tr>

            `;

        }
    );

}



/* =====================================================
   TIEMPOS
   ===================================================== */

function mostrarTiempos(
    tiempos
) {

    const tabla =
        document.getElementById(
            "tablaTiempos"
        );


    if (
        !tiempos ||
        tiempos.length === 0
    ) {

        tabla.innerHTML = `
            <tr>
                <td colspan="6">
                    No hay tiempos de reparación registrados.
                </td>
            </tr>
        `;

        return;

    }


    tabla.innerHTML = "";


    tiempos.forEach(
        function(item) {

            tabla.innerHTML += `

                <tr>

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
                        ${item.nombre_tecnico || "Sin técnico"}
                    </td>

                    <td>
                        ${formatearFecha(
                            item.fecha_inicio
                        )}
                    </td>

                    <td>
                        ${formatearFecha(
                            item.fecha_fin
                        )}
                    </td>

                    <td>
                        ${Number(
                            item.tiempo_reparacion
                        ).toFixed(2)}
                        h
                    </td>

                </tr>

            `;

        }
    );

}



/* =====================================================
   CARGAR REPORTES
   ===================================================== */

async function cargarReportes() {

    try {

        const respuesta =
            await fetch(
                "http://localhost:3000/api/gerente/reportes"
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datos.mensaje
            );

        }


        mostrarMantenimientos(
            datos.mantenimientos
        );


        mostrarRepuestos(
            datos.repuestos
        );


        mostrarTiempos(
            datos.tiempos
        );


    } catch (error) {

        console.error(
            "Error al cargar reportes:",
            error
        );


        document.getElementById(
            "tablaMantenimientos"
        ).innerHTML = `
            <tr>
                <td colspan="6">
                    No se pudieron consultar los reportes.
                </td>
            </tr>
        `;


        document.getElementById(
            "tablaRepuestos"
        ).innerHTML = `
            <tr>
                <td colspan="4">
                    No se pudieron consultar los reportes.
                </td>
            </tr>
        `;


        document.getElementById(
            "tablaTiempos"
        ).innerHTML = `
            <tr>
                <td colspan="6">
                    No se pudieron consultar los reportes.
                </td>
            </tr>
        `;

    }

}


cargarReportes();