const mysqlConnection = require('../database')

const verificarUsuarioVehiculo = (datos) =>{
    return new Promise((res, error) =>{
        const { ci, placa } = datos
        mysqlConnection.query('SELECT * FROM usuario_vehiculo WHERE ci = ? and placa = ?', [ci, placa], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const listaMisVehiculos = (ci) =>{
    return new Promise((res, error) =>{
        mysqlConnection.query('SELECT vehiculo.placa, marca, serie, modelo, combustion, vehiculo.imagen, dispositivo FROM usuario_vehiculo, vehiculo WHERE usuario_vehiculo.placa = vehiculo.placa and usuario_vehiculo.ci = ?', [ci], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarUsuarioVehiculo = (datos) =>{
    return new Promise((res, error) => {
        const { ci, placa } = datos
        mysqlConnection.query('INSERT INTO usuario_vehiculo(ci, placa) VALUES(?,?);',[ci, placa], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarRegistroUsuarioVehiculo = (datos) =>{
    return new Promise((res, error) => {
        const { ci, placa, ci_emisor, informe, fecha, hora } = datos
        mysqlConnection.query('INSERT INTO registro_usuario_vehiculo(ci, placa, ci_emisor, informe, fecha, hora) VALUES(?,?,?,?,?,?);',[ci, placa, ci_emisor, informe, fecha, hora], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const listaUsuariosVehiculosUbicacion = (dispositivo) =>{
    return new Promise((res, error) =>{
        mysqlConnection.query('SELECT ci FROM usuario_vehiculo, vehiculo WHERE usuario_vehiculo.placa = vehiculo.placa and vehiculo.dispositivo = ?', [dispositivo], (err, rows) => {
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
    verificarUsuarioVehiculo,
    listaMisVehiculos,
    agregarUsuarioVehiculo,
    agregarRegistroUsuarioVehiculo,
    listaUsuariosVehiculosUbicacion
}