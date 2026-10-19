const historialModel =
    require("../models/historial.model");


async function listarMaquinas(req, res) {

    try {

        const maquinas =
            await historialModel.obtenerMaquinas();

        res.json(maquinas);

    } catch (error) {

        console.error(
            "Error al consultar máquinas:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al consultar las máquinas."
        });
    }
}


async function consultarHistorial(req, res) {

    try {

        const idMaquina =
            req.params.id;

        const historial =
            await historialModel.obtenerHistorialMaquina(
                idMaquina
            );


        if (!historial) {

            return res.status(404).json({
                mensaje:
                    "La máquina no existe."
            });
        }


        res.json(historial);

    } catch (error) {

        console.error(
            "Error al consultar historial:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al consultar el historial de la máquina."
        });
    }
}


module.exports = {
    listarMaquinas,
    consultarHistorial
};