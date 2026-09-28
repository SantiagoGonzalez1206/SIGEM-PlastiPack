const solicitudes = [];

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


function crearSolicitud(req, res) {

    const {
        codigoMaquina,
        tipoMantenimiento,
        descripcionFalla,
        prioridad,
        usuario
    } = req.body;


    // Validar datos obligatorios

    if (
        !codigoMaquina ||
        !tipoMantenimiento ||
        !descripcionFalla ||
        !prioridad ||
        !usuario
    ) {

        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios."
        });

    }


    // Buscar máquina

    const maquina = maquinas.find(function(maquinaActual) {

        return maquinaActual.codigo === codigoMaquina;

    });


    if (!maquina) {

        return res.status(404).json({
            mensaje: "La máquina no existe."
        });

    }


    // Crear solicitud

    const nuevaSolicitud = {

        id: solicitudes.length + 1,

        codigoMaquina: maquina.codigo,

        nombreMaquina: maquina.nombre,

        ubicacion: maquina.ubicacion,

        tipoMantenimiento,

        descripcionFalla,

        prioridad,

        usuario,

        fechaHora: new Date().toISOString(),

        estado: "Abierta"

    };


    solicitudes.push(nuevaSolicitud);


    res.status(201).json({

        mensaje: "Solicitud registrada correctamente.",

        solicitud: nuevaSolicitud

    });

}


function obtenerSolicitudes(req, res) {

    res.json(solicitudes);

}


module.exports = {

    crearSolicitud,

    obtenerSolicitudes

};