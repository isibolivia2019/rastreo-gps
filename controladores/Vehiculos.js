const mysqlConnection = require('../database')

const verificarVehiculoPlaca = (placa) =>{
    return new Promise((res, error) =>{
        mysqlConnection.query('SELECT * FROM vehiculo WHERE placa = ?', [placa], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const listaVehiculos = () =>{
    return new Promise((res, error) =>{
        mysqlConnection.query('SELECT * FROM vehiculo', (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarVehiculo = (datos) =>{
    return new Promise((res, error) => {
        const { placa, marca, serie, modelo, combustion, imagen} = datos
        mysqlConnection.query('INSERT INTO vehiculo(placa, marca, serie, modelo, combustion, imagen) VALUES(?,?,?,?,?,?);',[placa, marca, serie, modelo, combustion, imagen], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarRegistroVehiculo = (datos) =>{
    return new Promise((res, error) => {
        const { placa, ci_emisor, informe, fecha, hora } = datos
        mysqlConnection.query('INSERT INTO registro_vehiculo(placa, ci_emisor, informe, fecha, hora) VALUES(?,?,?,?,?);',[placa, ci_emisor, informe, fecha, hora], (err, rows) => {
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
    verificarVehiculoPlaca,
    listaVehiculos,
    agregarVehiculo,
    agregarRegistroVehiculo
}