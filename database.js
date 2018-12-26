const mysql = require('mysql')

const mysqlConnection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '$IsiBolivia2018',
    database: 'gps'
})

mysqlConnection.connect(function (err) {
    if(err){
        console.log(err)
        return
    } else {
        console.log('Base de Datos MYSQL conectado')
    }
})

module.exports = mysqlConnection