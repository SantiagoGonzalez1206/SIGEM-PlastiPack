const usuario = localStorage.getItem("usuario");
const rol = localStorage.getItem("rol");

if (!usuario || !rol) {
    window.location.href = "../index.html";
}

if (rol !== "jefe") {
    window.location.href = "../index.html";
}

const usuarioSesion = document.getElementById("usuarioSesion");

if (usuarioSesion) {
    usuarioSesion.textContent = usuario;
}


async function cargarResumen() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/jefe/resumen"
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            console.error(datos.mensaje);
            return;
        }

        document.getElementById("otPendientes").textContent =
            datos.pendientes;

        document.getElementById("otUrgentes").textContent =
            datos.urgentes;

        document.getElementById("otEnEjecucion").textContent =
            datos.enEjecucion;

        document.getElementById("otActivas").textContent =
            datos.activas;

        document.getElementById("preventivosProgramados").textContent =
            datos.preventivosProgramados;

    } catch (error) {

        console.error(
            "Error al cargar resumen del jefe:",
            error
        );
    }
}

async function cargarAlertas() {

    const listaAlertas =
        document.getElementById("listaAlertas");

    if (!listaAlertas) {
        return;
    }

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/jefe/alertas"
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            listaAlertas.innerHTML = `
                <div class="alerta">
                    <p>
                        No se pudieron consultar las alertas.
                    </p>
                </div>
            `;

            return;
        }


        listaAlertas.innerHTML = "";

        let hayAlertas = false;


        datos.preventivos.forEach(function(preventivo) {

            hayAlertas = true;

            const fecha =
                new Date(preventivo.proxima_fecha);

            const hoy = new Date();

            const diferencia =
                Math.ceil(
                    (fecha - hoy) /
                    (1000 * 60 * 60 * 24)
                );


            let textoDias;

            if (diferencia === 0) {

                textoDias = "Vence hoy";

            } else if (diferencia === 1) {

                textoDias = "Vence en 1 día";

            } else {

                textoDias =
                    `Vence en ${diferencia} días`;

            }


            listaAlertas.innerHTML += `
                <div class="alerta">

                    <div>

                        <strong>
                            Preventivo próximo
                        </strong>

                        <p>
                            ${preventivo.codigo_maquina}
                            ·
                            ${preventivo.nombre_maquina}
                        </p>

                    </div>

                    <span>
                        ${textoDias}
                    </span>

                </div>
            `;

        });


        datos.ordenesUrgentes.forEach(function(orden) {

            hayAlertas = true;


            listaAlertas.innerHTML += `
                <div class="alerta">

                    <div>

                        <strong>
                            OT urgente
                        </strong>

                        <p>
                            OT-${orden.numero_consecutivo}
                            ·
                            ${orden.nombre_maquina}
                        </p>

                    </div>

                    <span>
                        Alta prioridad
                    </span>

                </div>
            `;

        });


        if (!hayAlertas) {

            listaAlertas.innerHTML = `
                <div class="alerta">

                    <p>
                        No hay alertas actualmente.
                    </p>

                </div>
            `;
        }


    } catch (error) {

        console.error(
            "Error al cargar alertas:",
            error
        );


        listaAlertas.innerHTML = `
            <div class="alerta">

                <p>
                    No se pudo conectar con el servidor.
                </p>

            </div>
        `;
    }
}

cargarAlertas();

cargarResumen();