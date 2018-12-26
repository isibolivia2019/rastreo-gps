const mysqlConnection = require('../database')

const listaFechaRutaTemporal = (dispositivo) =>{
    return new Promise((res, error) => {
        mysqlConnection.query('SELECT fecha FROM ubicacion WHERE dispositivo = ? GROUP BY fecha ORDER BY fecha DESC;',[dispositivo], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const listaRecorridoTemporal = (datos) =>{
    const { dispositivo, fecha } = datos
    return new Promise((res, error) => {
        mysqlConnection.query('SELECT codigo, latitud, longitud, velocidad, hora FROM ubicacion WHERE dispositivo = ? and fecha = ? ORDER BY hora ASC;',[dispositivo, fecha], (err, rows) => {
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
    listaFechaRutaTemporal,
    listaRecorridoTemporal
}