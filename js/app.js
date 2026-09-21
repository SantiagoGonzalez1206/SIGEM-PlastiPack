console.log("SIGEM iniciado correctamente");

const loginForm = document.getElementById("loginForm");
const mensajeLogin = document.getElementById("mensajeLogin");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    if (usuario === "" || password === "") {

        mensajeLogin.textContent = "Por favor, complete todos los campos.";

        return;
    }

    mensajeLogin.textContent = "Datos ingresados correctamente.";

});