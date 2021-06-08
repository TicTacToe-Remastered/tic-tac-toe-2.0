const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080']
    }
})

const teams = {
    blue: {
        count: 0,
        player: ''
    },
    red: {
        count: 0,
        player: ''
    }
}


io.on('connection', socket => {
    console.log('Client connected : ', socket.id)
    socket.broadcast.emit('receive-connection', socket.id)

    socket.on('disconnect', () => {
        const t = teams[Object.keys(teams).find(key => teams[key].player === socket.id)]
        socket.broadcast.emit('receive-disconnect', socket.id)
        if(!t) return
        t.count = 0
        t.player = ''
        io.emit('receive-teams', teams)
    })

    socket.on('get-teams', callback => {
        callback(teams)
    })

    socket.on('play', (user, box) => {
        socket.broadcast.emit('receive-play', user, box)
    })

    socket.on('join-team', (user, team, callback) => {
        if(Object.keys(teams).find(key => teams[key].player === user)) return callback('You already joined a team!')
        const t = teams[Object.keys(teams).find(key => key === team)]
        if (t.count == 0) {
            t.count = 1
            t.player = user
            io.emit('receive-teams', teams)
        } else {
            callback(`<b>${team}</b> is full!`)
        }
    })
})