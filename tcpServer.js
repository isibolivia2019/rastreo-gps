var net = require('net');
const DispositivosConf = require('./controladores/Dispositivos')
const FechaHora = require('./controladores/FechaHora')
const {socket} = require('./src/sockets')
import store from './src/store'

let dispositivos = [];
let enviarTCP
let swVelocidad = true;
let cantDispositivos = () =>{
  return new Promise((res, error) =>{
    let misdis = []
    for(let i=0;i<dispositivos.length;i++){
      misdis[i] = {codigo: dispositivos[i].codigo}
    }
    res(misdis)
  })
}

enviarTCP = (mensaje, codigo) => {
  console.log("==============================")
  console.log("enviarTCP:", codigo, "-", mensaje)
  const index = dispositivos.findIndex(i => i.codigo === codigo)
  console.log("cant dispositivo:", dispositivos.length)
  console.log("index:", index)
  if(index > -1){
    console.log("envio a:", dispositivos[index].codigo)
    dispositivos[index].socket.write(mensaje);
  }
  console.log("==============================")
};

const serverTCP = () => {
    net.createServer(function (socketTCP) {
        console.log('Nuevo Dispositivo');
        socketTCP.write("{conexion}");

        socketTCP.on('data', function(data) {
            let misdato = data + ""
            misdato = misdato.replace('\r\n', "")
            misdato = misdato.split("/")
            console.log('dispositivo:', misdato);
            
            var resul = dispositivos.findIndex(i => i.codigo === misdato[0]);
            if(resul == -1){
                if(misdato[0].length >= 4 && misdato[0].length <=5){
                    const datos = { socket: socketTCP, codigo: misdato[0]}
                    console.log(`agregando dispositivo -- codigo:${datos.codigo} socektTCP:${datos.socket}`)
                    dispositivos = dispositivos.concat(datos)

                    FechaHora.getFechaHoraActualMysql().then((res)=>{
                        const {fecha ,hora} = res
                        const mydatos = {dispositivo: misdato[0], mensaje: "Dispositivo Conectado al Sistema", fecha: fecha, hora: hora}

                        DispositivosConf.agregarRegistroLogDispositivo(mydatos).then((res)=>{
                        },(error)=>{
                            console.log(error)
                        })
                    },(error)=>{
                        console.log(error)
                    })
                }else{
                  console.log("dispositivo desconocido")
                }
            }
          
            if(misdato[0].length >= 4 && misdato[0].length <=5 && misdato[0] != undefined){

                if(misdato[1] == "cerrar"){
                    const resp = dispositivos.findIndex(i => i.codigo === misdato[0])
                    if(resp != -1){
                        console.log('cerrando conexion');
                        FechaHora.getFechaHoraActualMysql().then((res)=>{
                            const {fecha ,hora} = res
                            const misdatos = {dispositivo: dispositivos[resp].codigo, mensaje: "Actualizando conexion con el dispositivo", fecha: fecha, hora: hora}
                            DispositivosConf.agregarRegistroLogDispositivo(misdatos).then((res)=>{
                        },(error)=>{
                            console.log(error)
                        })
                        dispositivos.splice(resp, 1)
                        console.log("cant dispositivo:", dispositivos.length)
                        },(error)=>{
                            console.log(error)
                        })
                    }   
                }

                if(misdato[1] == "configuracion"){
                    DispositivosConf.listaConfiguracionDispositivo(misdato[0]).then((respuesta)=>{
                        const conf = "{conf/" + respuesta[0].numero_uno + "/" + respuesta[0].numero_dos + "/" + respuesta[0].numero_tres + "/" + respuesta[0].sensor_puerta + "/" + respuesta[0].alerta_bocina + "/" + respuesta[0].boton_seguridad +"/}"
                        enviarTCP(conf, misdato[0])
                    },(error)=>{
                        console.log(error)
                    })
                }

                if(misdato[1] == "ussd"){
                    console.log("recibi ussd:", misdato[2])
                    FechaHora.getFechaHoraActualMysql().then((res)=>{
                        const {fecha ,hora} = res
                        misdato[2] = misdato[2].replace(`"`, ``);
                        let usu = store.getState().codigoUsuario
                        const datos = {ussd: misdato[2], dispositivo: misdato[0], fecha: fecha, hora: hora, usuario: usu}
                            DispositivosConf.agregarUssdDispositivo(datos).then((res)=>{
                              socket.emit('mensajeUSSD', datos)
                            },(error)=>{
                                console.log(error)
                            })
                    },(error)=>{
                        console.log(error)
                    })
                }

                if(misdato[1] == "ubicacion"){
                    FechaHora.getFechaHoraActualMysql().then((res)=>{
                        const {fecha ,hora} = res
                        if(misdato[4] > 1){
                            swVelocidad = true;
                            const datos = {latitud: misdato[2], longitud: misdato[3], velocidad: misdato[4], dispositivo: misdato[0], fecha: fecha, hora: hora}
                            DispositivosConf.agregarUbicacionDispositivo(datos).then((res)=>{
                                socket.emit('rastreoTiempoReal', {dispositivo: misdato[0], latitud: misdato[2], longitud: misdato[3], velocidad: misdato[4], fecha, hora: hora})
                            },(error)=>{
                                console.log(error)
                            })
                        }else{
                            if(swVelocidad == true){
                                swVelocidad = false;
                                const datos = {latitud: misdato[2], longitud: misdato[3], velocidad: misdato[4], dispositivo: misdato[0], fecha: fecha, hora: hora}
                                DispositivosConf.agregarUbicacionDispositivo(datos).then((res)=>{
                                    socket.emit('rastreoTiempoReal', {dispositivo: misdato[0], latitud: misdato[2], longitud: misdato[3], velocidad: misdato[4], fecha, hora: hora})
                                },(error)=>{
                                  console.log(error)
                                })
                            }else{
                                const datos = {latitud: misdato[2], longitud: misdato[3], velocidad: misdato[4], fecha: fecha, hora: hora, dispositivo: misdato[0]}
                                DispositivosConf.actualizarUltimaUbicacionDispositivo(datos).then((res)=>{
                                    console.log("Agregando Ultima posicion:", datos.dispositivo)
                                },(error)=>{
                                    console.log(error)
                                })
                            }
                        }
                    },(error)=>{
                        console.log(error)
                    })
                }

                if(misdato[1] == "boton"){
                    console.log("boton SOS")
                }

                if(misdato[1] == "puerta"){
                    console.log("puerta Abierta")
                }
            }
        });
        socketTCP.on('end', function() {
            console.log(`end conexion`);
            const resp = dispositivos.findIndex(i => i.socket === socketTCP)
            if(resp != -1){
                console.log('ingreso a registro log de end');
                FechaHora.getFechaHoraActualMysql().then((res)=>{
                    const {fecha ,hora} = res
                    const misdatos = {dispositivo: dispositivos[resp].codigo, mensaje: "Dispositivo Desconectado del Sistema por algun tipo de Error", fecha: fecha, hora: hora}
                    DispositivosConf.agregarRegistroLogDispositivo(misdatos).then((res)=>{
                    },(error)=>{
                        console.log(error)
                    })
                    dispositivos.splice(resp, 1)
                console.log("cant dispositivo:", dispositivos.length)
                },(error)=>{
                    console.log(error)
                })
            }       
        });

        socketTCP.on('close', function() {
            console.log('close conexion');
        });

        socketTCP.on('error', function(e) {
            console.log('error conexion:', e);
            const resp = dispositivos.findIndex(i => i.socket === socketTCP)
            if(resp != -1){
                FechaHora.getFechaHoraActualMysql().then((res)=>{
                    const {fecha ,hora} = res
                    console.log('ingreso a registro log de error');
                    const misdatos = {dispositivo: dispositivos[resp].codigo, mensaje: "Dispositivo Desconectado del Sistema por algun tipo de Error", fecha: fecha, hora: hora}
                    DispositivosConf.agregarRegistroLogDispositivo(misdatos).then((res)=>{
                    },(error)=>{
                        console.log(error)
                    })
                    dispositivos.splice(res, 1)
                    console.log("cant dispositivo:", dispositivos.length)
                },(error)=>{
                    console.log(error)
                })
                
            }
        });
    }).listen(4321, function() {
      console.log('Server TCP en el puerto 4321');
    });
}

module.exports = { serverTCP, enviarTCP, cantDispositivos }