const mysqlConnection = require('../database')

const agregarEntregaNotificacion = (datos) =>{
    return new Promise((res, error) => {
        const { ci_emisor, ci_remitente, fecha_emisor, hora_emisor, estado, mensaje } = datos
        mysqlConnection.query('INSERT INTO registro_notificaciones(ci_emisor, ci_remitente, fecha_emisor, hora_emisor, estado, mensaje) VALUES(?,?,?,?,?,?);',[ci_emisor, ci_remitente, fecha_emisor, hora_emisor, estado, mensaje], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const listaNotificacionesRoot = (ci_remitente) =>{
    return new Promise((res, error) =>{
        mysqlConnection.query('SELECT * FROM registro_notificaciones WHERE estado = "Entregado" and ci_remitente = ?', [ci_remitente], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const listaActividades = (ci_remitente) =>{
    return new Promise((res, error) =>{
        mysqlConnection.query('SELECT * FROM registro_eventos_cliente WHERE ci = ?', [ci_remitente], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

module.exports = {
    agregarEntregaNotificacion,
    listaNotificacionesRoot,
    listaActividades
 }