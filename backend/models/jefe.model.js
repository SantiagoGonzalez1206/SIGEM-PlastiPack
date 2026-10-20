const conexion = require("../config/database");


async function obtenerResumenJefe() {

    const [ordenes] = await conexion.query(`
        SELECT
            SUM(
                CASE
                    WHEN estado = 'Pendiente'
                    THEN 1
                    ELSE 0
                END
            ) AS pendientes,

            SUM(
                CASE
                    WHEN estado = 'En proceso'
                    THEN 1
                    ELSE 0
                END
            ) AS enEjecucion,

            SUM(
                CASE
                    WHEN estado IN ('Pendiente', 'En proceso')
                    THEN 1
                    ELSE 0
                END
            ) AS activas,

            SUM(
                CASE
                    WHEN estado IN ('Pendiente', 'En proceso')
                    AND prioridad = 'Alta'
                    THEN 1
                    ELSE 0
                END
            ) AS urgentes

        FROM orden_de_trabajo
    `);


    const [preventivos] = await conexion.query(`
        SELECT
            COUNT(*) AS programados
        FROM mantenimiento_preventivo
        WHERE estado <> 'Cancelado'
        AND proxima_fecha >= CURDATE()
    `);


    return {

        pendientes:
            ordenes[0].pendientes || 0,

        enEjecucion:
            ordenes[0].enEjecucion || 0,

        activas:
            ordenes[0].activas || 0,

        urgentes:
            ordenes[0].urgentes || 0,

        preventivosProgramados:
            preventivos[0].programados || 0
    };
}


async function obtenerAlertasJefe() {

    const [preventivos] = await conexion.query(`
        SELECT
            p.id_preventivo,
            p.proxima_fecha,
            m.codigo AS codigo_maquina,
            m.nombre AS nombre_maquina

        FROM mantenimiento_preventivo p

        INNER JOIN maquina m
            ON p.id_maquina = m.id_maquina

        WHERE p.estado <> 'Cancelado'

        AND p.proxima_fecha >= CURDATE()

        AND p.proxima_fecha <=
            DATE_ADD(CURDATE(), INTERVAL 7 DAY)

        ORDER BY p.proxima_fecha ASC
    `);


    const [ordenes] = await conexion.query(`
        SELECT
            o.id_orden,
            o.numero_consecutivo,
            o.prioridad,
            o.estado,
            m.codigo AS codigo_maquina,
            m.nombre AS nombre_maquina

        FROM orden_de_trabajo o

        INNER JOIN solicitud s
            ON o.id_solicitud = s.id_solicitud

        INNER JOIN maquina m
            ON s.id_maquina = m.id_maquina

        WHERE o.prioridad = 'Alta'

        AND o.estado IN (
            'Pendiente',
            'En proceso'
        )

        ORDER BY o.id_orden DESC
    `);


    return {

        preventivos,

        ordenesUrgentes:
            ordenes
    };
}


/* =====================================================
   RF-03
   SOLICITUDES PENDIENTES DE VALIDACIÓN
===================================================== */

async function obtenerSolicitudesPendientes() {

    const [filas] = await conexion.query(`
        SELECT

            s.id_solicitud,

            s.tipo_mantenimiento,

            s.descripcion_falla,

            s.prioridad,

            s.fecha_hora,

            s.estado,

            u.usuario_institucional AS usuario,

            m.id_maquina,

            m.codigo AS codigo_maquina,

            m.nombre AS nombre_maquina,

            m.ubicacion,

            m.criticidad

        FROM solicitud s

        INNER JOIN usuario u
            ON s.id_usuario = u.id_usuario

        INNER JOIN maquina m
            ON s.id_maquina = m.id_maquina

        WHERE s.estado = 'Abierta'

        ORDER BY
            s.fecha_hora ASC
    `);


    return filas;
}


/* =====================================================
   RF-04
   CALCULAR PRIORIDAD
===================================================== */

function calcularPrioridad(
    criticidad,
    descripcion
) {

    const texto =
        (descripcion || "")
            .toLowerCase();


    const palabrasCriticas = [

        "parada",
        "detención",
        "detencion",
        "no funciona",
        "no enciende",
        "fuga",
        "humo",
        "incendio",
        "sobrecalentamiento"

    ];


    const fallaCritica =
        palabrasCriticas.some(
            function(palabra) {

                return texto.includes(
                    palabra
                );

            }
        );


    if (fallaCritica) {

        return "Alta";

    }


    if (criticidad === "Alta") {

        return "Alta";

    }


    if (criticidad === "Media") {

        return "Media";

    }


    return "Baja";
}


/* =====================================================
   RF-03 + RF-04 + RF-05
   VALIDAR SOLICITUD Y GENERAR OT
===================================================== */

async function validarSolicitud(
    idSolicitud
) {

    const conexionTransaccion =
        await conexion.getConnection();


    try {

        await conexionTransaccion.beginTransaction();


        const [solicitudes] =
            await conexionTransaccion.query(`
                SELECT

                    s.id_solicitud,

                    s.tipo_mantenimiento,

                    s.descripcion_falla,

                    s.prioridad,

                    s.estado,

                    s.id_maquina,

                    m.criticidad

                FROM solicitud s

                INNER JOIN maquina m
                    ON s.id_maquina = m.id_maquina

                WHERE s.id_solicitud = ?

                AND s.estado = 'Abierta'
            `, [idSolicitud]);


        if (solicitudes.length === 0) {

            await conexionTransaccion.rollback();

            return {
                codigo: "NO_DISPONIBLE"
            };

        }


        const solicitud =
            solicitudes[0];


        /* -----------------------------------------
           RF-03
           Verificar información suficiente
        ----------------------------------------- */

        if (
            !solicitud.tipo_mantenimiento ||
            !solicitud.descripcion_falla ||
            !solicitud.id_maquina
        ) {

            await conexionTransaccion.rollback();

            return {
                codigo: "INFORMACION_INSUFICIENTE"
            };

        }


        /* -----------------------------------------
           RF-04
           Determinar prioridad
        ----------------------------------------- */

        const prioridad =
            calcularPrioridad(
                solicitud.criticidad,
                solicitud.descripcion_falla
            );


        /* -----------------------------------------
           Actualizar solicitud
        ----------------------------------------- */

        await conexionTransaccion.query(`
            UPDATE solicitud

            SET
                prioridad = ?,
                estado = 'Validada'

            WHERE id_solicitud = ?
        `, [
            prioridad,
            idSolicitud
        ]);


        /* -----------------------------------------
           RF-05
           Generar número consecutivo
        ----------------------------------------- */

        const [ultimoOrden] =
            await conexionTransaccion.query(`
                SELECT
                    MAX(numero_consecutivo)
                    AS ultimo

                FROM orden_de_trabajo
            `);


        const numeroConsecutivo =
            (ultimoOrden[0].ultimo || 1000) + 1;


        /* -----------------------------------------
           Crear OT
        ----------------------------------------- */

        await conexionTransaccion.query(`
            INSERT INTO orden_de_trabajo
            (
                numero_consecutivo,
                prioridad,
                estado,
                id_solicitud,
                id_tecnico
            )

            VALUES
            (
                ?,
                ?,
                'Pendiente',
                ?,
                NULL
            )
        `, [
            numeroConsecutivo,
            prioridad,
            idSolicitud
        ]);


        await conexionTransaccion.commit();


        return {

            codigo: "VALIDADA",

            prioridad,

            numeroConsecutivo

        };


    } catch (error) {

        await conexionTransaccion.rollback();

        throw error;

    } finally {

        conexionTransaccion.release();

    }
}


module.exports = {

    obtenerResumenJefe,

    obtenerAlertasJefe,

    obtenerSolicitudesPendientes,

    validarSolicitud

};