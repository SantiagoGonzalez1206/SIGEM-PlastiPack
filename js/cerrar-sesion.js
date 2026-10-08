const botonCerrarSesion = document.getElementById("cerrarSesion");

if (botonCerrarSesion) {

    botonCerrarSesion.addEventListener("click", function(evento) {

        evento.preventDefault();

        localStorage.clear();

        window.location.href = "../index.html";
    });
}