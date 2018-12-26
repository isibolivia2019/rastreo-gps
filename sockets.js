import store from './src/store'
import {setCodigoUsuario, setNombreUsuario, setTipoUsuario} from './src/actionCreators'
let usuariosConectados = []

let getUsuariosConectados = () =>{
      return usuariosConectados
  }

const serverSocket = (io) => {
    io.on('connection', socket =>{
        console.log('Nuevo usuario conectado:', socket.id)
        socket.on('autentificacion', (usuario, cb) => {
            var resul = usuariosConectados.findIndex(i => i.codigo === usuario.codigo);
            if(resul == -1){
                cb(true)
                const datosUsuario = { socket: socket.id, codigo: usuario.codigo}
                usuariosConectados = usuariosConectados.concat(datosUsuario)
                io.emit('actualizaListaUsuariosConectados', usuariosConectados)
            }else{
                cb(false)
            }
            console.log("--- lista de Usuarios ---")
            for(let i = 0 ; i < usuariosConectados.length ; i++){
                console.log("usuario:", usuariosConectados[i])
                if(typeof usuariosConectados[i].socket === typeof undefined){
                    usuariosConectados.splice(i, 1)
                }
            }
            console.log("--- --- ---")
        })

        socket.on('disconnect', () => {
            //console.log('usuario desconectado:', socket.id)
            //console.log('resultado:', usuariosConectados.findIndex(i => i.socket === socket.id))
            store.dispatch(setCodigoUsuario(""))
            store.dispatch(setNombreUsuario(""))
            store.dispatch(setTipoUsuario(""))
            let res = usuariosConectados.findIndex(i => i.socket === socket.id)
            if(res != -1){
                usuariosConectados.splice(res, 1)
                io.emit('actualizaListaUsuariosConectados', usuariosConectados)
                console.log("--- lista de Usuarios ---")
                for(let i = 0 ; i < usuariosConectados.length ; i++){
                    console.log("usuario:", usuariosConectados[i])
                    if(typeof usuariosConectados[i].socket === typeof undefined){
                        usuariosConectados.splice(i, 1)
                    }
                }
                console.log("--- --- ---")  
            }
            
        })

        socket.on('cerrarSession', (idSocket) => {
            store.dispatch(setCodigoUsuario(""))
            store.dispatch(setNombreUsuario(""))
            store.dispatch(setTipoUsuario(""))
            let res = usuariosConectados.findIndex(i => i.socket === socket.id)
            if(res != -1){
                usuariosConectados.splice(res, 1)
                io.emit('actualizaListaUsuariosConectados', usuariosConectados)
                console.log("--- lista de Usuarios ---")
                for(let i = 0 ; i < usuariosConectados.length ; i++){
                    console.log("usuario:", usuariosConectados[i])
                    if(typeof usuariosConectados[i].socket === typeof undefined){
                        usuariosConectados.splice(i, 1)
                    }
                }
                console.log("--- --- ---")
            }
        })

        socket.on('listaUsuariosConectados', (dato, cb) => {
            cb(usuariosConectados)
        })

        socket.on('datosUsuarios', (ci, cb) => {
            const usuario = usuariosConectados.findIndex(i => i.ci === ci)
            cb(usuariosConectados[usuario])
        })

        require('./sockets/socket_usuarios')(socket, io)
        require('./sockets/socket_vehiculos')(socket, io)
        require('./sockets/socket_dispositivos')(socket, io)
        require('./sockets/socket_rutas')(socket, io)
    })
}

module.exports = { serverSocket, getUsuariosConectados }