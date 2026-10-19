const maquina =
    document.getElementById("maquina");

const frecuencia =
    document.getElementById("frecuencia");

const actividad =
    document.getElementById("actividad");

const proximaFecha =
    document.getElementById("proximaFecha");

const formularioPreventivo =
    document.getElementById("formularioPreventivo");

const mensajePreventivo =
    document.getElementById("mensajePreventivo");

const listaPreventivos =
    document.getElementById("listaPreventivos");


let idPreventivoEditando = null;


async function cargarMaquinas() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/jefe/preventivos/maquinas"
        );

        const maquinas = await respuesta.json();

        if (!respuesta.ok) {
            return;
        }

        maquina.innerHTML = `
            <option value="">
                Selecciona una máquina
            </option>
        `;


        maquinas.forEach(function(item) {

            const opcion =
                document.createElement("option");

            opcion.value =
                item.id_maquina;

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

        const preventivos =
            await respuesta.json();


        if (!respuesta.ok) {

            listaPreventivos.innerHTML = `
                <tr>
                    <td colspan="6">
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
                    <td colspan="6">
                        No hay mantenimientos preventivos registrados.
                    </td>
                </tr>
            `;

            return;
        }


        preventivos.forEach(function(item) {

            const fila =
                document.createElement("tr");


            const fecha =
                new Date(item.proxima_fecha);


            const fechaFormateada =
                fecha.toLocaleDateString("es-CO");


            let acciones = "";


            if (item.estado !== "Cancelado") {

                acciones = `
                    <div class="acciones-tabla">

                        <button
                            type="button"
                            class="boton-secundario"
                            onclick="editarPreventivo(
                                ${item.id_preventivo},
                                '${item.actividad.replace(/'/g, "\\'")}',
                                '${item.frecuencia}',
                                '${item.proxima_fecha}',
                                '${item.codigo_maquina}'
                            )"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            class="boton-secundario"
                            onclick="cancelarPreventivo(
                                ${item.id_preventivo}
                            )"
                        >
                            Cancelar
                        </button>

                    </div>
                `;

            } else {

                acciones = `
                    <span>
                        Sin acciones
                    </span>
                `;
            }


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

                <td>
                    ${acciones}
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
                <td colspan="6">
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

            mensajePreventivo.style.color =
                "red";

            return;
        }


        try {

            const datosFormulario = {

                actividad:
                    actividad.value.trim(),

                frecuencia:
                    frecuencia.value,

                proximaFecha:
                    proximaFecha.value,

                idMaquina:
                    maquina.value
            };


            let respuesta;


            if (idPreventivoEditando === null) {

                respuesta = await fetch(
                    "http://localhost:3000/api/jefe/preventivos",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(
                            datosFormulario
                        )
                    }
                );

            } else {

                respuesta = await fetch(
                    `http://localhost:3000/api/jefe/preventivos/${idPreventivoEditando}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(
                            datosFormulario
                        )
                    }
                );
            }


            const datos =
                await respuesta.json();


            if (!respuesta.ok) {

                mensajePreventivo.textContent =
                    datos.mensaje;

                mensajePreventivo.style.color =
                    "red";

                return;
            }


            mensajePreventivo.textContent =
                datos.mensaje;

            mensajePreventivo.style.color =
                "green";


            formularioPreventivo.reset();

            idPreventivoEditando = null;


            await cargarPreventivos();


        } catch (error) {

            mensajePreventivo.textContent =
                "No se pudo conectar con el servidor.";

            mensajePreventivo.style.color =
                "red";

            console.error(
                "Error al guardar preventivo:",
                error
            );
        }
    }
);


async function editarPreventivo(
    id,
    actividadActual,
    frecuenciaActual,
    fechaActual,
    codigoMaquina
) {

    idPreventivoEditando = id;

    actividad.value =
        actividadActual;

    frecuencia.value =
        frecuenciaActual;

    proximaFecha.value =
        fechaActual.substring(0, 10);


    const opciones =
        Array.from(maquina.options);

    const opcionEncontrada =
        opciones.find(function(opcion) {

            return opcion.textContent.startsWith(
                codigoMaquina
            );
        });


    if (opcionEncontrada) {

        maquina.value =
            opcionEncontrada.value;
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


async function cancelarPreventivo(id) {

    const confirmar =
        confirm(
            "¿Estás seguro de cancelar este mantenimiento preventivo?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const respuesta = await fetch(
            `http://localhost:3000/api/jefe/preventivos/${id}/cancelar`,
            {
                method: "PATCH"
            }
        );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            alert(datos.mensaje);

            return;
        }


        alert(datos.mensaje);

        await cargarPreventivos();


    } catch (error) {

        console.error(
            "Error al cancelar preventivo:",
            error
        );

        alert(
            "No se pudo conectar con el servidor."
        );
    }
}


cargarMaquinas();
cargarPreventivos();