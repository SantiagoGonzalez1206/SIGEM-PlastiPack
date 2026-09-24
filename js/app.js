const formularioLogin = document.getElementById("loginForm");
const mensajeLogin = document.getElementById("mensajeLogin");

if (formularioLogin) {

    formularioLogin.addEventListener("submit", async function(evento) {

        evento.preventDefault();

        const usuarioIngresado = document.getElementById("usuario").value.trim();
        const passwordIngresado = document.getElementById("password").value;

        // Validar campos vacíos

        if (usuarioIngresado === "" || passwordIngresado === "") {

            mensajeLogin.textContent = "Por favor, completa todos los campos.";
            mensajeLogin.style.color = "red";

            return;
        }

        try {

            const respuesta = await fetch("http://localhost:3000/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    usuario: usuarioIngresado,
                    password: passwordIngresado
                })

            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {

                mensajeLogin.textContent = datos.mensaje;
                mensajeLogin.style.color = "red";

                return;
            }

            mensajeLogin.textContent = datos.mensaje;
            mensajeLogin.style.color = "green";

            // Guardar información básica de la sesión

            localStorage.setItem("usuario", datos.usuario);
            localStorage.setItem("rol", datos.rol);

            // Redireccionar según el rol

            if (datos.rol === "operario") {

                window.location.href = "pages/operario.html";

            }

        } catch (error) {

            mensajeLogin.textContent = "No se pudo conectar con el servidor.";
            mensajeLogin.style.color = "red";

            console.error("Error de conexión:", error);
        }

    });
}