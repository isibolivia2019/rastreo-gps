const Vehiculos = require('../controladores/Vehiculos')
const UsuariosVehiculos = require('../controladores/UsuariosVehiculos')

module.exports = function(socket, io){
    socket.on('listaVehiculos', async (datos, cb) => {
        Vehiculos.listaVehiculos().then((respuesta)=>{
            cb(respuesta)
        },(error)=>{
            console.log(error)
        })
    })

    socket.on('listaMisVehiculos', async (ci, cb) => {
        UsuariosVehiculos.listaMisVehiculos(ci).then((respuesta)=>{
            cb(respuesta)
        },(error)=>{
            console.log(error)
        })
    })

    socket.on('agregarVehiculo', async (datos, cb) => {
        Vehiculos.agregarVehiculo(datos).then((res)=>{
            io.emit('actualizaListaVehiculo', vehiculo)
            cb(true)
        },(error)=>{
            console.log(error)
            cb(false)
        })
    })
}