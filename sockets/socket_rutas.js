const Dispositivos = require('../controladores/Dispositivos')
const UsuariosVehiculos = require('../controladores/UsuariosVehiculos')
const Rutas = require('../controladores/Rutas')
import {getUsuariosConectados} from '../sockets'
module.exports = function(socket, io){
    socket.on('rastreoTiempoReal', async datos => {
        let lista = getUsuariosConectados();
        UsuariosVehiculos.listaUsuariosVehiculosUbicacion(datos.dispositivo).then((respuesta)=>{
            for(var i = 0 ; i < respuesta.length ; i++){
                let usu = respuesta[i].ci
                var resul = lista.findIndex(i => i.codigo === usu);
                if(resul != -1){
                    console.log("enviando a:", lista[resul].codigo)
                    io.to(lista[resul].socket).emit('rastreoTiempoReal', datos)
                }
            }
        },(error)=>{
            console.log(error)
        })
    })

    socket.on('mensajeUSSD', async datos => {
        let lista = getUsuariosConectados();
        UsuariosVehiculos.listaUsuariosVehiculosUbicacion(datos.dispositivo).then((respuesta)=>{
            for(var i = 0 ; i < respuesta.length ; i++){
                let usu = respuesta[i].ci
                var resul = lista.findIndex(i => i.codigo === usu);
                if(resul != -1){
                    console.log("enviando USSD a:", lista[resul].codigo)
                    io.to(lista[resul].socket).emit('mensajeUSSD', datos)
                }
            }
        },(error)=>{
            console.log(error)
        })
    })

    socket.on('posicionActual', async (dispositivo, cb) => {
        Dispositivos.listaUltimaPosicion(dispositivo).then((respuesta)=>{
            cb(respuesta)
        },(error)=>{
            console.log(error)
        })
    })

    socket.on('recorrido', async (datos, cb) => {
        Rutas.listaRecorridoTemporal(datos).then((respuesta)=>{
            cb(respuesta)
        },(error)=>{
            console.log(error)
        })
    })

    socket.on('listaRutaTemporal', async (dispositivo, cb) => {
        Rutas.listaFechaRutaTemporal(dispositivo).then((respuesta)=>{
            cb(respuesta)
        },(error)=>{
            console.log(error)
        })
    })
}