const express = require('express');
const router = express.Router();
const Usuarios = require('../controladores/Usuarios')

router.post('/api/autentificacion', async (req, res) => {
    Usuarios.autentificacion(req.body).then((respuesta)=>{
        if(respuesta.length > 0){
            req.session.codigo = respuesta[0].ci
            req.session.nombre = respuesta[0].nombre + ' ' + respuesta[0].appat + ' ' + respuesta[0].apmat
            req.session.tipo = respuesta[0].tipo
        }
        res.json(respuesta)
    },(error)=>{
        console.log(error)
    })
});

router.post('/api/verificar-autentificacion', async (req, res) => {
    if(req.session.codigo){
        const data = {codigo: req.session.codigo, nombre: req.session.nombre, tipo: req.session.tipo}
        console.log("si...resp:", data)
        res.json(data)
    }else{
        const data = {codigo: "", nombre: ""}
        console.log("noo...resp:", data)
        res.json(data)
    }
});

router.get('/api/cerrarsession', async (req, res) => {
    req.session.destroy();
});

module.exports = router