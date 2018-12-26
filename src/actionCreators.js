const rutaLogin = () => {
    return {
        type: "RUTA_LOGIN"
      }
}

const setCodigoUsuario = (codigo) => {
    return {
        type: "SET_CODIGO_USUARIO",
        codigo
      }
}

const setNombreUsuario = (nombre) => {
    return {
        type: "SET_NOMBRE_USUARIO",
        nombre
      }
}

const setTipoUsuario = (tipo) => {
    return {
        type: "SET_TIPO_USUARIO",
        tipo
      }
}

const usuarioSel = (usuario) => {
    return {
        type: "USUARIO_VEHICULAR_AGREGAR",
        usuario
      }
}

const rastreoVehiculos = (vehiculos) => {
    return {
        type: "INICIAR_RASTREO",
        vehiculos
      }
}

const fechaRecorrido = (fecha) => {
    return {
        type: "FECHA_RECORRIDO",
        fecha
      }
}

const horaRecorrido = (hora) => {
    return {
        type: "HORA_RECORRIDO",
        hora
      }
}

export {
    rutaLogin,
    setCodigoUsuario,
    setNombreUsuario,
    setTipoUsuario,
    usuarioSel,
    rastreoVehiculos,
    fechaRecorrido,
    horaRecorrido
}