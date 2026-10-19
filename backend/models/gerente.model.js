const conexion = require("../config/database");


/* =====================================================
   RESUMEN DEL GERENTE
   ===================================================== */

async function obtenerResumenGerente() {

    const [ordenes] = await conexion.query(`
        SELECT

            COUNT(*) AS total,

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
            ) AS en_proceso,

            SUM(
                CASE
                    WHEN estado = 'Cerrada'
                    THEN 1
                    ELSE 0
                END
            ) AS cerradas,

            SUM(
                CASE
                    WHEN estado = 'Cancelada'
                    THEN 1
                    ELSE 0
                END
            ) AS canceladas

        FROM orden_de_trabajo
    `);


    const [tiempo] = await conexion.query(`
        SELECT
            AVG(tiempo_reparacion) AS promedio_reparacion
        FROM intervencion
        WHERE tiempo_reparacion IS NOT NULL
    `);


    const [mantenimientos] = await conexion.query(`
        SELECT

            SUM(
                CASE
                    WHEN tipo_mantenimiento = 'Correctivo'
                    THEN 1
                    ELSE 0
                END
            ) AS correctivos,

            SUM(
                CASE
                    WHEN tipo_mantenimiento = 'Preventivo'
                    THEN 1
                    ELSE 0
                END
            ) AS preventivos

        FROM solicitud
    `);


    return {

        total:
            ordenes[0].total || 0,

        pendientes:
            ordenes[0].pendientes || 0,

        enProceso:
            ordenes[0].en_proceso || 0,

        cerradas:
            ordenes[0].cerradas || 0,

        canceladas:
            ordenes[0].canceladas || 0,

        promedioReparacion:
            tiempo[0].promedio_reparacion || 0,

        correctivos:
            mantenimientos[0].correctivos || 0,

        preventivos:
            mantenimientos[0].preventivos || 0
    };
}



/* =====================================================
   REPORTES
   ===================================================== */

async function obtenerReportesGerente() {

    const [mantenimientos] = await conexion.query(`
        SELECT

            o.numero_consecutivo,

            m.codigo AS codigo_maquina,
            m.nombre AS nombre_maquina,

            s.tipo_mantenimiento,
            s.prioridad,

            u.nombre AS nombre_tecnico,

            o.fecha_cierre

        FROM orden_de_trabajo o

        INNER JOIN solicitud s
            ON o.id_solicitud = s.id_solicitud

        INNER JOIN maquina m
            ON s.id_maquina = m.id_maquina

        LEFT JOIN usuario u
            ON o.id_tecnico = u.id_usuario

        WHERE o.estado = 'Cerrada'

        ORDER BY
            o.fecha_cierre DESC
    `);


    const [repuestos] = await conexion.query(`
        SELECT

            r.codigo,
            r.nombre,

            SUM(d.cantidad) AS cantidad_total,

            SUM(
                d.cantidad * d.costo_unitario
            ) AS costo_total

        FROM detalle_de_repuesto d

        INNER JOIN intervencion i
            ON d.id_intervencion = i.id_intervencion

        INNER JOIN repuesto r
            ON d.id_repuesto = r.id_repuesto

        GROUP BY
            r.id_repuesto,
            r.codigo,
            r.nombre

        ORDER BY
            cantidad_total DESC
    `);


    const [tiempos] = await conexion.query(`
        SELECT

            o.numero_consecutivo,

            m.codigo AS codigo_maquina,
            m.nombre AS nombre_maquina,

            u.nombre AS nombre_tecnico,

            i.fecha_inicio,
            i.fecha_fin,
            i.tiempo_reparacion

        FROM intervencion i

        INNER JOIN orden_de_trabajo o
            ON i.id_orden = o.id_orden

        INNER JOIN solicitud s
            ON o.id_solicitud = s.id_solicitud

        INNER JOIN maquina m
            ON s.id_maquina = m.id_maquina

        LEFT JOIN usuario u
            ON o.id_tecnico = u.id_usuario

        WHERE i.tiempo_reparacion IS NOT NULL

        ORDER BY
            i.fecha_fin DESC
    `);


    return {

        mantenimientos,
        repuestos,
        tiempos

    };
}



/* =====================================================
   INDICADORES
   ===================================================== */

async function obtenerIndicadoresGerente() {

    const [ordenes] = await conexion.query(`
        SELECT

            COUNT(*) AS total_ordenes,

            SUM(
                CASE
                    WHEN estado = 'Cerrada'
                    THEN 1
                    ELSE 0
                END
            ) AS ordenes_cerradas,

            SUM(
                CASE
                    WHEN estado IN ('Pendiente', 'En proceso')
                    THEN 1
                    ELSE 0
                END
            ) AS ordenes_activas,

            SUM(
                CASE
                    WHEN estado = 'Cancelada'
                    THEN 1
                    ELSE 0
                END
            ) AS ordenes_canceladas

        FROM orden_de_trabajo
    `);


    const [tiempo] = await conexion.query(`
        SELECT

            AVG(tiempo_reparacion)
                AS promedio_reparacion,

            MAX(tiempo_reparacion)
                AS mayor_reparacion,

            MIN(tiempo_reparacion)
                AS menor_reparacion

        FROM intervencion

        WHERE tiempo_reparacion IS NOT NULL
    `);


    const [tipos] = await conexion.query(`
        SELECT

            SUM(
                CASE
                    WHEN tipo_mantenimiento = 'Correctivo'
                    THEN 1
                    ELSE 0
                END
            ) AS correctivos,

            SUM(
                CASE
                    WHEN tipo_mantenimiento = 'Preventivo'
                    THEN 1
                    ELSE 0
                END
            ) AS preventivos

        FROM solicitud
    `);


    const [maquinas] = await conexion.query(`
        SELECT

            SUM(
                CASE
                    WHEN estado = 'Operativo'
                    THEN 1
                    ELSE 0
                END
            ) AS operativas,

            SUM(
                CASE
                    WHEN estado = 'En reparación'
                    THEN 1
                    ELSE 0
                END
            ) AS en_reparacion,

            SUM(
                CASE
                    WHEN estado = 'Fuera de servicio'
                    THEN 1
                    ELSE 0
                END
            ) AS fuera_servicio

        FROM maquina
    `);


    const [repuestos] = await conexion.query(`
        SELECT

            COALESCE(
                SUM(d.cantidad),
                0
            ) AS unidades,

            COALESCE(
                SUM(
                    d.cantidad *
                    d.costo_unitario
                ),
                0
            ) AS costo

        FROM detalle_de_repuesto d
    `);


    return {

        ordenes: ordenes[0],

        tiempo: tiempo[0],

        tipos: tipos[0],

        maquinas: maquinas[0],

        repuestos: repuestos[0]

    };
}


module.exports = {

    obtenerResumenGerente,

    obtenerReportesGerente,

    obtenerIndicadoresGerente

};