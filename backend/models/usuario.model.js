const conexion = require("../config/database");

async function buscarUsuarioPorCredenciales(usuario, password) {

    const [filas] = await conexion.query(
        `SELECT
            u.id_usuario,
            u.usuario_institucional,
            u.nombre,
            u.password_hash,
            u.habilitado,
            r.nombre AS rol
        FROM usuario u
        INNER JOIN rol r
            ON u.id_rol = r.id_rol
        WHERE u.usuario_institucional = ?
        AND u.password_hash = SHA2(?, 256)
        AND u.habilitado = TRUE`,
        [usuario, password]
    );

    return filas[0];
}

module.exports = {
    buscarUsuarioPorCredenciales
};