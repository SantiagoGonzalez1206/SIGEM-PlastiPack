console.log("SIGEM iniciado correctamente");


/* =========================
   USUARIOS DE PRUEBA
   ========================= */

const usuarios = [
    {
        usuario: "operario@plastipack.com",
        password: "1234",
        rol: "operario"
    },
    {
        usuario: "tecnico@plastipack.com",
        password: "1234",
        rol: "tecnico"
    },
    {
        usuario: "jefe@plastipack.com",
        password: "1234",
        rol: "jefe"
    },
    {
        usuario: "gerente@plastipack.com",
        password: "1234",
        rol: "gerente"
    }
];


/* =========================
   FORMULARIO DE LOGIN
   ========================= */

const loginForm = document.getElementById("loginForm");
const mensajeLogin = document.getElementById("mensajeLogin");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const usuarioIngresado = document.getElementById("usuario").value;
    const passwordIngresada = document.getElementById("password").value;


    /* Validar campos vacíos */

    if (usuarioIngresado === "" || passwordIngresada === "") {

        mensajeLogin.textContent =
            "Por favor, complete todos los campos.";

        return;
    }


    /* Buscar usuario */

    const usuarioEncontrado = usuarios.find(function(usuario) {

        return usuario.usuario === usuarioIngresado &&
               usuario.password === passwordIngresada;

    });


    /* Validar credenciales */

    if (usuarioEncontrado) {

        mensajeLogin.textContent =
            "Inicio de sesión correcto.";

        console.log("Usuario:", usuarioEncontrado.usuario);
        console.log("Rol:", usuarioEncontrado.rol);

    } else {

        mensajeLogin.textContent =
            "Usuario o contraseña incorrectos.";

    }

});