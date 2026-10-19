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



async function cargarIndicadores() {

    try {

        const respuesta =
            await fetch(
                "http://localhost:3000/api/gerente/indicadores"
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datos.mensaje
            );

        }


        /* -----------------------------------------
           ÓRDENES
           ----------------------------------------- */

        document.getElementById(
            "totalOrdenes"
        ).textContent =
            datos.ordenes.total_ordenes || 0;


        document.getElementById(
            "ordenesCerradas"
        ).textContent =
            datos.ordenes.ordenes_cerradas || 0;


        document.getElementById(
            "ordenesActivas"
        ).textContent =
            datos.ordenes.ordenes_activas || 0;


        document.getElementById(
            "ordenesCanceladas"
        ).textContent =
            datos.ordenes.ordenes_canceladas || 0;



        /* -----------------------------------------
           TIEMPOS
           ----------------------------------------- */

        document.getElementById(
            "promedioReparacion"
        ).textContent =
            Number(
                datos.tiempo.promedio_reparacion || 0
            ).toFixed(2);


        document.getElementById(
            "mayorReparacion"
        ).textContent =
            Number(
                datos.tiempo.mayor_reparacion || 0
            ).toFixed(2);


        document.getElementById(
            "menorReparacion"
        ).textContent =
            Number(
                datos.tiempo.menor_reparacion || 0
            ).toFixed(2);



        /* -----------------------------------------
           TIPOS
           ----------------------------------------- */

        document.getElementById(
            "correctivos"
        ).textContent =
            datos.tipos.correctivos || 0;


        document.getElementById(
            "preventivos"
        ).textContent =
            datos.tipos.preventivos || 0;



        /* -----------------------------------------
           MÁQUINAS
           ----------------------------------------- */

        document.getElementById(
            "operativas"
        ).textContent =
            datos.maquinas.operativas || 0;


        document.getElementById(
            "enReparacion"
        ).textContent =
            datos.maquinas.en_reparacion || 0;


        document.getElementById(
            "fueraServicio"
        ).textContent =
            datos.maquinas.fuera_servicio || 0;



        /* -----------------------------------------
           REPUESTOS
           ----------------------------------------- */

        document.getElementById(
            "unidadesRepuestos"
        ).textContent =
            datos.repuestos.unidades || 0;


        document.getElementById(
            "costoRepuestos"
        ).textContent =
            formatearMoneda(
                datos.repuestos.costo
            );


    } catch (error) {

        console.error(
            "Error al cargar indicadores:",
            error
        );

    }

}


cargarIndicadores();