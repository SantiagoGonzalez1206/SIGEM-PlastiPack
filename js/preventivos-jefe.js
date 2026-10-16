const maquina = document.getElementById("maquina");
const frecuencia = document.getElementById("frecuencia");
const actividad = document.getElementById("actividad");
const proximaFecha = document.getElementById("proximaFecha");

const formularioPreventivo =
    document.getElementById("formularioPreventivo");

const mensajePreventivo =
    document.getElementById("mensajePreventivo");

const listaPreventivos =
    document.getElementById("listaPreventivos");


async function cargarMaquinas() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/jefe/preventivos/maquinas"
        );

        const maquinas = await respuesta.json();

        if (!respuesta.ok) {
            console.error("No se pudieron cargar las máquinas.");
            return;
        }

        maquina.innerHTML = `
            <option value="">
                Selecciona una máquina
            </option>
        `;

        maquinas.forEach(function(item) {

            const opcion = document.createElement("option");

            opcion.value = item.id_maquina;

            opcion.textContent =
                `${item.codigo} - ${item.nombre}`;

            maquina.appendChild(opcion);

        });

    } catch (error) {

        console.error(
            "Error al cargar máquinas:",
            error
        );

    }

}


async function cargarPreventivos() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/jefe/preventivos"
        );

        const preventivos = await respuesta.json();

        if (!respuesta.ok) {

            listaPreventivos.innerHTML = `
                <tr>
                    <td colspan="5">
                        No se pudieron consultar los mantenimientos.
                    </td>
                </tr>
            `;

            return;
        }

        listaPreventivos.innerHTML = "";

        if (preventivos.length === 0) {

            listaPreventivos.innerHTML = `
                <tr>
                    <td colspan="5">
                        No hay mantenimientos preventivos programados.
                    </td>
                </tr>
            `;

            return;
        }


        preventivos.forEach(function(item) {

            const fila = document.createElement("tr");

            const fecha = new Date(
                item.proxima_fecha
            );

            const fechaFormateada =
                fecha.toLocaleDateString("es-CO");


            fila.innerHTML = `

                <td>
                    ${item.codigo_maquina}
                    <span class="texto-secundario">
                        ${item.nombre_maquina}
                    </span>
                </td>

                <td>
                    ${item.actividad}
                </td>

                <td>
                    ${item.frecuencia}
                </td>

                <td>
                    ${fechaFormateada}
                </td>

                <td>
                    ${item.estado}
                </td>

            `;

            listaPreventivos.appendChild(fila);

        });

    } catch (error) {

        console.error(
            "Error al cargar preventivos:",
            error
        );

        listaPreventivos.innerHTML = `
            <tr>
                <td colspan="5">
                    No se pudo conectar con el servidor.
                </td>
            </tr>
        `;

    }

}


formularioPreventivo.addEventListener(
    "submit",
    async function(evento) {

        evento.preventDefault();

        if (
            maquina.value === "" ||
            frecuencia.value === "" ||
            actividad.value.trim() === "" ||
            proximaFecha.value === ""
        ) {

            mensajePreventivo.textContent =
                "Completa todos los campos.";

            mensajePreventivo.style.color = "red";

            return;
        }


        try {

            const respuesta = await fetch(
                "http://localhost:3000/api/jefe/preventivos",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        actividad:
                            actividad.value.trim(),

                        frecuencia:
                            frecuencia.value,

                        proximaFecha:
                            proximaFecha.value,

                        idMaquina:
                            maquina.value

                    })
                }
            );


            const datos = await respuesta.json();


            if (!respuesta.ok) {

                mensajePreventivo.textContent =
                    datos.mensaje;

                mensajePreventivo.style.color = "red";

                return;
            }


            mensajePreventivo.textContent =
                datos.mensaje;

            mensajePreventivo.style.color = "green";


            formularioPreventivo.reset();


            await cargarPreventivos();


        } catch (error) {

            mensajePreventivo.textContent =
                "No se pudo conectar con el servidor.";

            mensajePreventivo.style.color = "red";

            console.error(
                "Error al registrar preventivo:",
                error
            );

        }

    }
);


cargarMaquinas();
cargarPreventivos();