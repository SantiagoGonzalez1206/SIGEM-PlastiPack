const {
    buscarUsuarioPorCredenciales
} = require("../models/usuario.model");


async function iniciarSesion(req, res) {

    try {

        const { usuario, password } = req.body;

        if (!usuario || !password) {

            return res.status(400).json({
                mensaje: "Usuario y contraseña son obligatorios."
            });
        }


        const usuarioEncontrado =
            await buscarUsuarioPorCredenciales(usuario, password);


        if (!usuarioEncontrado) {

            return res.status(401).json({
                mensaje: "Usuario o contraseña incorrectos."
            });
        }


        res.json({
            mensaje: "Inicio de sesión exitoso.",
            usuario: usuarioEncontrado.usuario_institucional,
            nombre: usuarioEncontrado.nombre,
            rol: convertirRol(usuarioEncontrado.rol)
        });

    } catch (error) {

        console.error("Error al iniciar sesión:", error);

        res.status(500).json({
            mensaje: "Error al iniciar sesión."
        });
    }
}


function convertirRol(nombreRol) {

    if (nombreRol === "Operario de producción") {
        return "operario";
    }

    if (nombreRol === "Técnico de mantenimiento") {
        return "tecnico";
    }

    if (nombreRol === "Jefe de mantenimiento") {
        return "jefe";
    }

    if (nombreRol === "Gerente de planta") {
        return "gerente";
    }

    return "";
}


module.exports = {
    iniciarSesion
};