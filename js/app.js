console.log("SIGEM iniciado correctamente");

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    if (usuario === "" || password === "") {
        alert("Por favor, complete todos los campos.");
        return;
    }

    alert("Datos ingresados correctamente.");

});