const gerenteModel =
    require("../models/gerente.model");


/* =====================================================
   RESUMEN
   ===================================================== */

async function obtenerResumen(req, res) {

    try {

        const resumen =
            await gerenteModel.obtenerResumenGerente();

        res.json(resumen);

    } catch (error) {

        console.error(
            "Error al obtener resumen del gerente:",
            error
        );

        res.status(500).json({

            mensaje:
                "Error al consultar el resumen del gerente."

        });

    }

}


/* =====================================================
   REPORTES
   ===================================================== */

async function obtenerReportes(req, res) {

    try {

        const reportes =
            await gerenteModel.obtenerReportesGerente();

        res.json(reportes);

    } catch (error) {

        console.error(
            "Error al obtener reportes:",
            error
        );

        res.status(500).json({

            mensaje:
                "Error al consultar los reportes."

        });

    }

}


/* =====================================================
   INDICADORES
   ===================================================== */

async function obtenerIndicadores(req, res) {

    try {

        const indicadores =
            await gerenteModel.obtenerIndicadoresGerente();

        res.json(indicadores);

    } catch (error) {

        console.error(
            "Error al obtener indicadores:",
            error
        );

        res.status(500).json({

            mensaje:
                "Error al consultar los indicadores."

        });

    }

}


module.exports = {

    obtenerResumen,

    obtenerReportes,

    obtenerIndicadores

};