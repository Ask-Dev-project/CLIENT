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

  socket.on('join-room', roomId => {
    socket.join(roomId)
    socket.emit("socket-id",socket.id)
    socket.to(roomId).emit('other-join',socket.id)
  })

  socket.on('leave-room', roomId => {
    socket.leave(roomId)
    socket.to(roomId).emit('someone-leave',socket.id)
  })

  socket.on('sharing', (roomId) => {
    socket.to(roomId).emit('someone-sharing')
  })

  socket.on("offer", payload => {
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", payload => {
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", payload => {
    io.to(payload.target).emit("ice-candidate", payload.candidate);
  });
})

server.listen(3005, () => console.log(`server on port ${3005}`))