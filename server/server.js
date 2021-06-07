const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080']
    }
})

io.on('connection', socket => {
    console.log('Client connected : ', socket.id)
    socket.broadcast.emit('receive-connection', socket.id)

    socket.on('send-play', (user, box) => {
        socket.broadcast.emit('receive-play', user, box)
    })
})