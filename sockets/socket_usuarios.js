const Usuarios = require('../controladores/Usuarios')
const UsuariosVehiculos = require('../controladores/UsuariosVehiculos')
module.exports = function(socket, io){

    /*socket.on('verificaRegistroUsuario', async (ci, cb) => {
        const usuarios = await ModeloUsuarios.find({"ci": ci})
        if (usuarios) {
            cb(true)
        }else{
            cb(false)
        }
    })*/

    socket.on('listaUsuarios', async (datos, cb) => {
        Usuarios.listaUsuarios().then((respuesta)=>{
            cb(respuesta)
        },(error)=>{
            console.log(error)
        })
    })

    socket.on('agregarUsuario', async (datos, cb) => {
        Usuarios.agregarUsuario(datos).then((res)=>{
            io.emit('actualizaListaUsuario', datos)
            cb(true)
        },(error)=>{
            console.log(error)
            cb(false)
        })
    })

    socket.on('agregarUsuarioVehiculo', async (datos, cb) => {
        UsuariosVehiculos.agregarUsuarioVehiculo(datos).then((res)=>{
            cb(true)
        },(error)=>{
            console.log(error)
            cb(false)
        })
    })
}