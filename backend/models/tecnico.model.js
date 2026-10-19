const conexion = require("../config/database");


async function obtenerTecnicos() {

    const [filas] = await conexion.query(`
        SELECT
            u.id_usuario,
            u.nombre,
            u.usuario_institucional
        FROM usuario u
        INNER JOIN rol r
            ON u.id_rol = r.id_rol
        WHERE r.nombre = 'Técnico de mantenimiento'
        AND u.habilitado = TRUE
        ORDER BY u.nombre
    `);

    return filas;
}


async function obtenerOrdenesTecnico(usuario) {

    const [filas] = await conexion.query(`
        SELECT
            o.id_orden,
            o.numero_consecutivo,
            o.prioridad,
            o.estado,
            o.fecha_cierre,

            s.id_solicitud,
            s.tipo_mantenimiento,
            s.descripcion_falla,

            m.id_maquina,
            m.codigo AS codigo_maquina,
            m.nombre AS nombre_maquina,
            m.ubicacion,
            m.estado AS estado_maquina

        FROM orden_de_trabajo o

        INNER JOIN solicitud s
            ON o.id_solicitud = s.id_solicitud

        INNER JOIN maquina m
            ON s.id_maquina = m.id_maquina

        INNER JOIN usuario u
            ON o.id_tecnico = u.id_usuario

        WHERE u.usuario_institucional = ?

        ORDER BY o.id_orden DESC
    `, [usuario]);

    return filas;
}


async function obtenerOrdenTecnico(idOrden, usuario) {

    const [filas] = await conexion.query(`
        SELECT
            o.id_orden,
            o.numero_consecutivo,
            o.prioridad,
            o.estado,
            o.fecha_cierre,

            s.id_solicitud,
            s.tipo_mantenimiento,
            s.descripcion_falla,

            m.id_maquina,
            m.codigo AS codigo_maquina,
            m.nombre AS nombre_maquina,
            m.ubicacion,
            m.estado AS estado_maquina,

            u.nombre AS nombre_tecnico

        FROM orden_de_trabajo o

        INNER JOIN solicitud s
            ON o.id_solicitud = s.id_solicitud

        INNER JOIN maquina m
            ON s.id_maquina = m.id_maquina

        INNER JOIN usuario u
            ON o.id_tecnico = u.id_usuario

        WHERE o.id_orden = ?
        AND u.usuario_institucional = ?
    `, [idOrden, usuario]);

    return filas[0];
}


async function obtenerIntervencion(idOrden) {

    const [filas] = await conexion.query(`
        SELECT
            id_intervencion,
            diagnostico,
            tiempo_reparacion,
            estado_equipo,
            fecha_hora,
            fecha_inicio,
            fecha_fin
        FROM intervencion
        WHERE id_orden = ?
        ORDER BY id_intervencion DESC
        LIMIT 1
    `, [idOrden]);

    return filas[0];
}


async function obtenerRepuestos() {

    const [filas] = await conexion.query(`
        SELECT
            id_repuesto,
            codigo,
            nombre,
            existencia,
            costo_unitario
        FROM repuesto
        WHERE existencia > 0
        ORDER BY nombre
    `);

    return filas;
}


async function obtenerRepuestosOrden(idOrden) {

    const [filas] = await conexion.query(`
        SELECT
            d.id_detalle,
            d.cantidad,
            d.costo_unitario,

            r.id_repuesto,
            r.codigo,
            r.nombre

        FROM detalle_de_repuesto d

        INNER JOIN intervencion i
            ON d.id_intervencion = i.id_intervencion

        INNER JOIN repuesto r
            ON d.id_repuesto = r.id_repuesto

        WHERE i.id_orden = ?

        ORDER BY d.id_detalle DESC
    `, [idOrden]);

    return filas;
}


async function guardarDiagnostico(
    idOrden,
    diagnostico,
    fechaInicio
) {

    const [intervenciones] =
        await conexion.query(`
            SELECT id_intervencion
            FROM intervencion
            WHERE id_orden = ?
            ORDER BY id_intervencion DESC
            LIMIT 1
        `, [idOrden]);


    if (intervenciones.length > 0) {

        const [resultado] =
            await conexion.query(`
                UPDATE intervencion
                SET
                    diagnostico = ?,
                    fecha_inicio = ?
                WHERE id_intervencion = ?
            `, [
                diagnostico,
                fechaInicio,
                intervenciones[0].id_intervencion
            ]);

        return resultado.affectedRows;
    }


    const [resultado] =
        await conexion.query(`
            INSERT INTO intervencion
            (
                diagnostico,
                fecha_inicio,
                fecha_hora,
                id_orden
            )
            VALUES (?, ?, NOW(), ?)
        `, [
            diagnostico,
            fechaInicio,
            idOrden
        ]);

    return resultado.insertId;
}


async function guardarTiempoReparacion(
    idOrden,
    fechaInicio,
    fechaFin,
    tiempoReparacion
) {

    const [resultado] =
        await conexion.query(`
            UPDATE intervencion
            SET
                fecha_inicio = ?,
                fecha_fin = ?,
                tiempo_reparacion = ?
            WHERE id_orden = ?
        `, [
            fechaInicio,
            fechaFin,
            tiempoReparacion,
            idOrden
        ]);

    return resultado.affectedRows;
}


async function actualizarEstadoMaquina(
    idOrden,
    estadoEquipo
) {

    const [ordenes] =
        await conexion.query(`
            SELECT
                s.id_maquina
            FROM orden_de_trabajo o

            INNER JOIN solicitud s
                ON o.id_solicitud = s.id_solicitud

            WHERE o.id_orden = ?
        `, [idOrden]);


    if (ordenes.length === 0) {
        return 0;
    }


    const [resultado] =
        await conexion.query(`
            UPDATE maquina
            SET estado = ?
            WHERE id_maquina = ?
        `, [
            estadoEquipo,
            ordenes[0].id_maquina
        ]);


    await conexion.query(`
        UPDATE intervencion
        SET estado_equipo = ?
        WHERE id_orden = ?
    `, [
        estadoEquipo,
        idOrden
    ]);


    return resultado.affectedRows;
}


async function agregarRepuesto(
    idOrden,
    idRepuesto,
    cantidad
) {

    const conexionTransaccion =
        await conexion.getConnection();

    try {

        await conexionTransaccion.beginTransaction();


        const [intervenciones] =
            await conexionTransaccion.query(`
                SELECT id_intervencion
                FROM intervencion
                WHERE id_orden = ?
                ORDER BY id_intervencion DESC
                LIMIT 1
            `, [idOrden]);


        if (intervenciones.length === 0) {

            await conexionTransaccion.rollback();

            return {
                error: "La orden todavía no tiene una intervención registrada."
            };
        }


        const idIntervencion =
            intervenciones[0].id_intervencion;


        const [repuestos] =
            await conexionTransaccion.query(`
                SELECT
                    existencia,
                    costo_unitario
                FROM repuesto
                WHERE id_repuesto = ?
                FOR UPDATE
            `, [idRepuesto]);


        if (repuestos.length === 0) {

            await conexionTransaccion.rollback();

            return {
                error: "El repuesto no existe."
            };
        }


        if (repuestos[0].existencia < cantidad) {

            await conexionTransaccion.rollback();

            return {
                error: "No hay suficiente existencia del repuesto."
            };
        }


        await conexionTransaccion.query(`
            INSERT INTO detalle_de_repuesto
            (
                cantidad,
                costo_unitario,
                id_intervencion,
                id_repuesto
            )
            VALUES (?, ?, ?, ?)
        `, [
            cantidad,
            repuestos[0].costo_unitario,
            idIntervencion,
            idRepuesto
        ]);


        await conexionTransaccion.query(`
            UPDATE repuesto
            SET existencia = existencia - ?
            WHERE id_repuesto = ?
        `, [
            cantidad,
            idRepuesto
        ]);


        await conexionTransaccion.commit();


        return {
            correcto: true
        };

    } catch (error) {

        await conexionTransaccion.rollback();

        throw error;

    } finally {

        conexionTransaccion.release();
    }
}


async function cerrarOrden(idOrden) {

    const [intervenciones] =
        await conexion.query(`
            SELECT
                id_intervencion,
                diagnostico,
                tiempo_reparacion,
                fecha_inicio,
                fecha_fin
            FROM intervencion
            WHERE id_orden = ?
            ORDER BY id_intervencion DESC
            LIMIT 1
        `, [idOrden]);


    if (intervenciones.length === 0) {

        return {
            correcto: false,
            mensaje:
                "La orden no tiene una intervención registrada."
        };
    }


    const intervencion =
        intervenciones[0];


    if (!intervencion.diagnostico) {

        return {
            correcto: false,
            mensaje:
                "Debes registrar el diagnóstico antes de cerrar la orden."
        };
    }


    if (
        !intervencion.fecha_inicio ||
        !intervencion.fecha_fin ||
        intervencion.tiempo_reparacion === null
    ) {

        return {
            correcto: false,
            mensaje:
                "Debes registrar el tiempo de reparación antes de cerrar la orden."
        };
    }


    const [resultado] =
        await conexion.query(`
            UPDATE orden_de_trabajo
            SET
                estado = 'Cerrada',
                fecha_cierre = NOW()
            WHERE id_orden = ?
            AND estado IN ('Pendiente', 'En proceso')
        `, [idOrden]);


    if (resultado.affectedRows === 0) {

        return {
            correcto: false,
            mensaje:
                "La orden no se puede cerrar en su estado actual."
        };
    }


    return {
        correcto: true,
        mensaje:
            "Orden de trabajo cerrada correctamente."
    };
}


module.exports = {
    obtenerTecnicos,
    obtenerOrdenesTecnico,
    obtenerOrdenTecnico,
    obtenerIntervencion,
    obtenerRepuestos,
    obtenerRepuestosOrden,
    guardarDiagnostico,
    guardarTiempoReparacion,
    actualizarEstadoMaquina,
    agregarRepuesto,
    cerrarOrden
};