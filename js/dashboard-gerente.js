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



async function cargarResumen() {

    try {

        const respuesta =
            await fetch(
                "http://localhost:3000/api/gerente/resumen"
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datos.mensaje
            );

        }


        document.getElementById(
            "totalOrdenes"
        ).textContent =
            datos.total;


        document.getElementById(
            "ordenesCerradas"
        ).textContent =
            datos.cerradas;


        document.getElementById(
            "ordenesActivas"
        ).textContent =
            Number(datos.pendientes) +
            Number(datos.enProceso);


        document.getElementById(
            "promedioReparacion"
        ).textContent =
            Number(
                datos.promedioReparacion
            ).toFixed(2);


        document.getElementById(
            "correctivos"
        ).textContent =
            datos.correctivos;


        document.getElementById(
            "preventivos"
        ).textContent =
            datos.preventivos;


    } catch (error) {

        console.error(
            "Error al cargar resumen del gerente:",
            error
        );

    }

}


cargarResumen();