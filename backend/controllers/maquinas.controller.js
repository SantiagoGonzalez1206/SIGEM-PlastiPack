const maquinas = [
    {
        id: 1,
        codigo: "M001",
        nombre: "Inyectora 01",
        ubicacion: "Producción",
        criticidad: "Alta",
        estado: "Operativo"
    },
    {
        id: 2,
        codigo: "M002",
        nombre: "Empacadora 01",
        ubicacion: "Empaque",
        criticidad: "Media",
        estado: "Operativo"
    },
    {
        id: 3,
        codigo: "M003",
        nombre: "Compresor 01",
        ubicacion: "Mantenimiento",
        criticidad: "Alta",
        estado: "Operativo"
    }
];


function obtenerMaquinas(req, res) {

    res.json(maquinas);

}


function obtenerMaquinaPorCodigo(req, res) {

    const codigo = req.params.codigo;

    const maquina = maquinas.find(function(maquinaActual) {
        return maquinaActual.codigo === codigo;
    });

    if (!maquina) {

        return res.status(404).json({
            mensaje: "La máquina no existe."
        });

    }

    res.json(maquina);

}


module.exports = {
    obtenerMaquinas,
    obtenerMaquinaPorCodigo
};