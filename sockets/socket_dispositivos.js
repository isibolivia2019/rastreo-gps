const Dispositivos = require('../controladores/Dispositivos')

const { enviarTCP, cantDispositivos } = require('../tcpServer')

module.exports = function(socket, io){
    socket.on('dispositivosConectados', async (datos, cb) => {
        cantDispositivos().then((respuesta)=>{
            cb(respuesta)
        })
    })

    socket.on('listaDispositivos', async (datos, cb) => {
        Dispositivos.listaDispositivos().then((respuesta)=>{
            cb(respuesta)
        },(error)=>{
            console.log(error)
        })
    })

    socket.on('agregarDispositivo', async (datos, cb) => {
        Dispositivos.agregarDispositivo(datos).then((res)=>{
            Dispositivos.agregarConfiguracionDispositivo(datos.codigo).then((res)=>{
                io.emit('actualizaListaDispositivo', datos)
                cb(true)
            },(error)=>{
                console.log(error)
                cb(false)
            })
        },(error)=>{
            console.log(error)
            cb(false)
        })
    })

    socket.on('listaConfiguracion', async (dispositivo, cb) => {
        Dispositivos.listaConfiguracionDispositivo(dispositivo).then((respuesta)=>{
            cb(respuesta)
        },(error)=>{
            console.log(error)
        })
    })

    socket.on('actualizarSensorDispositivo', async (datos, cb) => {
        Dispositivos.actualizarSensorDispositivo(datos).then((res)=>{
            enviarTCP(`{${datos.sensor}/${datos.estado}/}`, datos.dispositivo);
            cb(true)
        },(error)=>{
            console.log(error)
            cb(false)
        })
    })

    socket.on('actualizarDatosDispositivo', async (datos, cb) => {
        Dispositivos.actualizarDatosDispositivo(datos).then((res)=>{
            enviarTCP(`{nro/${datos.numero_uno}/${datos.numero_dos}/${datos.numero_tres}/}`, datos.dispositivo);
            cb(true)
        },(error)=>{
            console.log(error)
            cb(false)
        })
    })

    socket.on('enviarUSSDDispositivo', async (datos) => {
        enviarTCP(`{ussd/${datos.ussd}/}`, datos.dispositivo);
    })
}