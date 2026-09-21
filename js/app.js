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

const formularioLogin = document.getElementById("loginForm");
const mensajeLogin = document.getElementById("mensajeLogin");

if (formularioLogin) {

    formularioLogin.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const usuarioIngresado = document.getElementById("usuario").value.trim();
        const passwordIngresado = document.getElementById("password").value;

        const usuarioEncontrado = usuarios.find(function(usuario) {
            return usuario.usuario === usuarioIngresado &&
                   usuario.password === passwordIngresado;
        });

        if (!usuarioEncontrado) {

            mensajeLogin.textContent = "Usuario o contraseña incorrectos.";
            mensajeLogin.style.color = "red";

            return;
        }

        mensajeLogin.textContent = "Inicio de sesión exitoso.";
        mensajeLogin.style.color = "green";

        if (usuarioEncontrado.rol === "operario") {
            window.location.href = "pages/operario.html";
        }

    });
}