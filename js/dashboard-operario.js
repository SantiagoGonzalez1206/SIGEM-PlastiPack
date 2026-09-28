const usuario = localStorage.getItem("usuario");
const rol = localStorage.getItem("rol");

if (!usuario || !rol) {

    window.location.href = "../index.html";

}

if (rol !== "operario") {

    window.location.href = "../index.html";

}

const usuarioSesion = document.getElementById("usuarioSesion");

if (usuarioSesion) {

    usuarioSesion.textContent = usuario;

}