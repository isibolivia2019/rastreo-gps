import { createStore, applyMiddleware } from 'redux'

const reducer = (state, action) => {
    if(action.type === "RUTA_LOGIN"){
        return {
            rutaLogin: true
        }
    }

    if(action.type === "SET_CODIGO_USUARIO"){
        return {
            ...state,
            codigoUsuario: action.codigo
        }
    }

    if(action.type === "SET_NOMBRE_USUARIO"){
        return {
            ...state,
            nombreUsuario: action.nombre
        }
    }

    if(action.type === "SET_TIPO_USUARIO"){
        return {
            ...state,
            tipoUsuario: action.tipo
        }
    }

    if(action.type === "USUARIO_VEHICULAR_AGREGAR"){
        return {
            ...state,
            usuarioSel: action.usuario
        }
    }

    if(action.type === "INICIAR_RASTREO"){
        return {
            ...state,
            rastreoVehiculos: action.vehiculos
        }
    }

    if(action.type === "FECHA_RECORRIDO"){
        return {
            ...state,
            fecha: action.fecha
        }
    }
    if(action.type === "HORA_RECORRIDO"){
        return {
            ...state,
            hora: action.hora
        }
    }
    return state
}

const logger = store => next => action =>{
    console.log('dispatching', action)
    let result = next (action)
    console.log('next state', store.getState())
    return result
}

export default createStore(reducer, {
    rutaLogin: false,
    codigoUsuario: "",
    nombreUsuario: "",
    tipoUsuario: "",
    usuarioSel: [],
    rastreoVehiculos: [],
    fecha: "",
    hora: []
}, applyMiddleware(logger))