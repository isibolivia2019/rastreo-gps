const getFechaActualMysql = ()=>{
    return new Promise((res, error) => {
        var d=new Date()
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var f = new Date(utc + (3600000 * (-4.0)));

        var fecha=f.getFullYear()+"-"+f.getMonth()+"-"+f.getDate()
        res(fecha)
    })
}

const getHoraActual = ()=>{
    return new Promise((res, error) => {
        var d=new Date()
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var f = new Date(utc + (3600000 * (-4.0)));

        var hora=f.getHours()+":"+f.getMinutes()+":"+f.getSeconds()
        res(hora)
    })
}

const getFechaHoraActualMysql = ()=>{
    return new Promise((res, error) => {
        var d=new Date()
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var f = new Date(utc + (3600000 * (-4.0)));

        var fecha=f.getFullYear()+"-"+(f.getMonth() + 1)+"-"+f.getDate()
        var hora=f.getHours()+":"+f.getMinutes()+":"+f.getSeconds()
        const datos = {
        fecha: fecha,
        hora : hora
    };
        res(datos)
    })
}

module.exports = {
    getFechaActualMysql,
    getHoraActual,
    getFechaHoraActualMysql
}