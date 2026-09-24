function estadoAPI(req, res) {
    res.json({
        mensaje: "API SIGEM funcionando correctamente"
    });
}

module.exports = {
    estadoAPI
};