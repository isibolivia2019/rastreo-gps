const mysqlConnection = require('../database')

const verificarDispositivoCodigo = (codigo) =>{
    return new Promise((res, error) =>{
        mysqlConnection.query('SELECT * FROM dispositivo WHERE codigo = ?', [codigo], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}
const listaDispositivos = () =>{
    return new Promise((res, error) =>{
        mysqlConnection.query('SELECT * FROM dispositivo', (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const enlazarVehiculoDispositivo = (datos) =>{
    return new Promise((res, error) => {
        const { placa, dispositivo } = datos
        mysqlConnection.query('UPDATE vehiculo SET dispositivo = ? WHERE placa = ?',[dispositivo, placa], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarDispositivo = (datos) =>{
    return new Promise((res, error) => {
        const { codigo, modelo, imei, nro_sim } = datos
        mysqlConnection.query('INSERT INTO dispositivo VALUES(?,?,?,?);',[codigo, modelo, imei, nro_sim], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarRegistroLogDispositivo = (datos) =>{
    return new Promise((res, error) => {
        const { dispositivo, mensaje, fecha, hora } = datos
        mysqlConnection.query('INSERT INTO dispositivo_registro_log(dispositivo, mensaje, fecha, hora) VALUES(?,?,?,?);',[dispositivo, mensaje, fecha, hora], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarUltimaUbicacionDispositivo = (datos) =>{
    return new Promise((res, error) => {
        const {dispositivo} = datos
        mysqlConnection.query('INSERT INTO ultima_ubicacion(dispositivo) VALUES(?);',[dispositivo], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const actualizarUltimaUbicacionDispositivo = (datos) =>{
    return new Promise((res, error) => {
        const {latitud, longitud, velocidad, dispositivo, fecha, hora} = datos
        mysqlConnection.query('UPDATE ultima_ubicacion SET latitud=?, longitud=?, velocidad=?, fecha=?, hora=? WHERE dispositivo=?;',[latitud, longitud, velocidad, fecha, hora, dispositivo], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarUbicacionDispositivo = (datos) =>{
    return new Promise((res, error) => {
        const {latitud, longitud, velocidad, dispositivo, fecha, hora} = datos
        mysqlConnection.query('INSERT INTO ubicacion(latitud, longitud, velocidad, dispositivo, fecha, hora) VALUES(?,?,?,?,?,?);',[latitud, longitud, velocidad, dispositivo, fecha, hora], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarUssdDispositivo = (datos) =>{
    return new Promise((res, error) => {
        const {ussd, dispositivo, fecha, hora, usuario} = datos
        mysqlConnection.query('INSERT INTO ussd(ussd, dispositivo, fecha, hora, usuario) VALUES(?,?,?,?,?);',[ussd, dispositivo, fecha, hora, usuario], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarConfiguracionDispositivo = (dispositivo) =>{
    return new Promise((res, error) => {
        mysqlConnection.query('INSERT INTO configuracion_dispositivo(codigo, numero_uno, numero_dos, numero_tres, sensor_puerta, boton_seguridad, rastreo_tiempo_real, bloqueo_motor, alerta_bocina) VALUES(?,?,?,?,?,?,?,?,?);',[dispositivo, '0','0','0','0','0','0','0','0'], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const listaConfiguracionDispositivo = (dispositivo) =>{
    return new Promise((res, error) => {
        mysqlConnection.query('SELECT * FROM configuracion_dispositivo WHERE codigo = ?', [dispositivo],(err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const listaUltimaPosicion = (dispositivo) =>{
    return new Promise((res, error) => {
        mysqlConnection.query('SELECT * FROM ubicacion WHERE dispositivo = ? ORDER BY codigo DESC LIMIT 1', [dispositivo],(err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const listaUbicacion = (dispositivo) =>{
    return new Promise((res, error) => {
        mysqlConnection.query('SELECT * FROM ubicacion WHERE dispositivo = ?', [dispositivo],(err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarRegistroDispositivo = (datos) =>{
    return new Promise((res, error) => {
        const { dispositivo, ci_emisor, informe, fecha, hora } = datos
        mysqlConnection.query('INSERT INTO registro_dispositivo(dispositivo, ci_emisor, informe, fecha, hora) VALUES(?,?,?,?,?);',[dispositivo, ci_emisor, informe, fecha, hora], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarRegistrovehiculoDispositivo = (datos) =>{
    return new Promise((res, error) => {
        const { placa, dispositivo, ci_emisor, informe, fecha, hora } = datos
        mysqlConnection.query('INSERT INTO registro_vehiculo_dispositivo(placa, dispositivo, ci_emisor, informe, fecha, hora) VALUES(?,?,?,?,?,?);',[placa, dispositivo, ci_emisor, informe, fecha, hora], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarRegistroConfiguracionDispositivo = (datos) =>{
    return new Promise((res, error) => {
        const {dispositivo, ci_emisor, informe, fecha, hora } = datos
        mysqlConnection.query('INSERT INTO registro_configuracion_dispositivo(dispositivo, ci_emisor, informe, fecha, hora) VALUES(?,?,?,?,?);',[dispositivo, ci_emisor, informe, fecha, hora], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const leerConfiguracionDispositivo = (dispositivo) =>{
    return new Promise((res, error) => {
        mysqlConnection.query('SELECT * FROM configuracion_dispositivo WHERE codigo = ?;',[dispositivo], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const actualizarSensorDispositivo = (datos) =>{
    return new Promise((res, error) => {
        const {dispositivo, sensor, estado} = datos
        mysqlConnection.query(`UPDATE configuracion_dispositivo SET ${sensor}=? WHERE codigo=?`,[estado, dispositivo], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const actualizarDatosDispositivo = (datos) =>{
    return new Promise((res, error) => {
        const {dispositivo, numero_uno, numero_dos, numero_tres} = datos
        mysqlConnection.query('UPDATE configuracion_dispositivo SET numero_uno=?, numero_dos=?, numero_tres=? WHERE codigo=?',[numero_uno, numero_dos, numero_tres, dispositivo], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

module.exports = { verificarDispositivoCodigo,
                listaDispositivos,
                agregarDispositivo,
                agregarRegistroLogDispositivo,
                agregarUbicacionDispositivo,
                agregarUltimaUbicacionDispositivo,
                agregarUssdDispositivo,
                actualizarUltimaUbicacionDispositivo,
                listaUbicacion,
                listaUltimaPosicion,
                agregarRegistroDispositivo,
                enlazarVehiculoDispositivo,
                agregarRegistrovehiculoDispositivo,
                leerConfiguracionDispositivo,
                agregarConfiguracionDispositivo,
                listaConfiguracionDispositivo,
                agregarRegistroConfiguracionDispositivo,
                actualizarSensorDispositivo,
                actualizarDatosDispositivo
            }