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

function iniciarSesion(req, res) {

    const { usuario, password } = req.body;

    const usuarioEncontrado = usuarios.find(function(usuarioActual) {
        return usuarioActual.usuario === usuario &&
               usuarioActual.password === password;
    });

    if (!usuarioEncontrado) {

        return res.status(401).json({
            mensaje: "Usuario o contraseña incorrectos."
        });
    }

    res.json({
        mensaje: "Inicio de sesión exitoso.",
        usuario: usuarioEncontrado.usuario,
        rol: usuarioEncontrado.rol
    });
}

module.exports = {
    iniciarSesion
};