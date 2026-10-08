const conexion = require("../config/database");

async function obtenerSolicitudes() {

    const [filas] = await conexion.query(`
        SELECT
            s.id_solicitud,
            s.tipo_mantenimiento,
            s.descripcion_falla,
            s.prioridad,
            s.fecha_hora,
            s.estado,
            u.usuario_institucional AS usuario,
            m.codigo AS codigoMaquina,
            m.nombre AS nombreMaquina,
            m.ubicacion
        FROM solicitud s
        INNER JOIN usuario u
            ON s.id_usuario = u.id_usuario
        INNER JOIN maquina m
            ON s.id_maquina = m.id_maquina
        ORDER BY s.fecha_hora DESC
    `);

    return filas;
}


async function crearSolicitud(
    tipoMantenimiento,
    descripcionFalla,
    prioridad,
    usuario,
    codigoMaquina
) {

    const conexionTransaccion = await conexion.getConnection();

    try {

        await conexionTransaccion.beginTransaction();


        const [usuarios] = await conexionTransaccion.query(
            `SELECT id_usuario
             FROM usuario
             WHERE usuario_institucional = ?`,
            [usuario]
        );

        if (usuarios.length === 0) {

            await conexionTransaccion.rollback();

            return null;
        }

        const idUsuario = usuarios[0].id_usuario;


        const [maquinas] = await conexionTransaccion.query(
            `SELECT id_maquina
             FROM maquina
             WHERE codigo = ?`,
            [codigoMaquina]
        );

        if (maquinas.length === 0) {

            await conexionTransaccion.rollback();

            return null;
        }

        const idMaquina = maquinas[0].id_maquina;


        const [resultadoSolicitud] =
            await conexionTransaccion.query(
                `INSERT INTO solicitud
                (
                    tipo_mantenimiento,
                    descripcion_falla,
                    prioridad,
                    fecha_hora,
                    estado,
                    id_usuario,
                    id_maquina
                )
                VALUES (?, ?, ?, NOW(), 'Abierta', ?, ?)`,
                [
                    tipoMantenimiento,
                    descripcionFalla,
                    prioridad,
                    idUsuario,
                    idMaquina
                ]
            );


        const idSolicitud = resultadoSolicitud.insertId;


        const [ultimoOrden] =
            await conexionTransaccion.query(
                `SELECT MAX(numero_consecutivo) AS ultimo
                 FROM orden_de_trabajo`
            );


        const numeroConsecutivo =
            (ultimoOrden[0].ultimo || 1000) + 1;


        await conexionTransaccion.query(
            `INSERT INTO orden_de_trabajo
            (
                numero_consecutivo,
                prioridad,
                estado,
                id_solicitud,
                id_tecnico
            )
            VALUES (?, ?, 'Pendiente', ?, NULL)`,
            [
                numeroConsecutivo,
                prioridad,
                idSolicitud
            ]
        );


        await conexionTransaccion.commit();

        return idSolicitud;

    } catch (error) {

        await conexionTransaccion.rollback();

        throw error;

    } finally {

        conexionTransaccion.release();
    }
}


module.exports = {
    obtenerSolicitudes,
    crearSolicitud
};