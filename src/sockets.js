import io from 'socket.io-client'

let socket = io.connect('http://127.0.0.1:3000')
//let socket = io.connect('http://35.238.16.21:3000')
socket.on('connect', () => {
   console.log('cliente socket:', socket.id)
})
module.exports = {socket}