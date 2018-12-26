const mysqlConnection = require('../database')

const autentificacion = (datos) =>{
    const { ci, pass } = datos
    return new Promise((res, error) =>{
        mysqlConnection.query('SELECT * FROM usuario WHERE ci = ? and pass = ?', [ci, pass], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const verificarUsuarioCi = (ci) =>{
    return new Promise((res, error) =>{
        mysqlConnection.query('SELECT * FROM usuario WHERE ci = ?', [ci], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarLoginFallido = (datos) =>{
    return new Promise((res, error) => {
        const { usuario, pass, plataforma, fecha, hora } = datos
        mysqlConnection.query('INSERT INTO registro_login_fallido(usuario, pass, plataforma, fecha, hora) VALUES(?,?,?,?,?);',[ usuario, pass, plataforma, fecha, hora ], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarUsuarioLogueado = (datos) =>{
    return new Promise((res, error) => {
        const { usuario, plataforma, fecha, hora } = datos
        mysqlConnection.query('INSERT INTO registro_usuario_logueado(ci, plataforma, fecha, hora) VALUES(?,?,?,?);',[ usuario, plataforma, fecha, hora ], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const listaUsuarios = () =>{
    return new Promise((res, error) =>{
        mysqlConnection.query('SELECT * FROM usuario', (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const listaUsuariosTipo = (tipo) =>{
    return new Promise((res, error) =>{
        mysqlConnection.query('SELECT ci FROM usuario WHERE tipo = ?', [tipo],(err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarUsuario = (datos) =>{
    return new Promise((res, error) => {
        const { ci, ci_exp, nombre, appat, apmat, telefono, email, tipo, password, imagen } = datos
        mysqlConnection.query('INSERT INTO usuario VALUES(?,?,?,?,?,?,?,?,?,?);',[ci, ci_exp, nombre, appat, apmat, telefono, email, password, imagen, tipo], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

const agregarRegistroUsuario = (datos) =>{
    return new Promise((res, error) => {
        const { ci, ci_emisor, informe, fecha, hora } = datos
        mysqlConnection.query('INSERT INTO registro_usuario(ci, ci_emisor, informe, fecha, hora) VALUES(?,?,?,?,?);',[ci, ci_emisor, informe, fecha, hora], (err, rows) => {
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
    verificarUsuarioCi,
    listaUsuarios,
    listaUsuariosTipo,
    agregarUsuario,
    agregarRegistroUsuario,
    autentificacion,
    agregarLoginFallido,
    agregarUsuarioLogueado
}