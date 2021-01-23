const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["allow"],
    credentials: true
  }
})

// const users = {}
const rooms = {}

io.on('connection', socket => {

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
  socket.on('stop-sharing', roomId => {
    socket.to(roomId).emit('stop-sharing')
  })

})

server.listen(3005, () => console.log(`server on port ${3005}`))