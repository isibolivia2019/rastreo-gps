const mysqlConnection = require('../database')

const agregarEventoCliente = (datos) =>{
    return new Promise((res, error) => {
        const { ci, plataforma, fecha, hora, mensaje } = datos
        mysqlConnection.query('INSERT INTO registro_eventos_cliente(ci, plataforma, fecha, hora, mensaje) VALUES(?,?,?,?,?);',[ci, plataforma, fecha, hora, mensaje], (err, rows) => {
            if(!err){
                res(rows)
            } else {
                console.log(err)
                error(err)
            }
        })
    })
}

module.exports = { agregarEventoCliente }