const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080']
    }
});

let teams = {
    blue: {
        count: 0,
        player: ''
    },
    red: {
        count: 0,
        player: ''
    }
};

let grid = [
    [0, '', ''], [0, '', ''], [0, '', ''],
    [0, '', ''], [0, '', ''], [0, '', ''],
    [0, '', ''], [0, '', ''], [0, '', '']
];
//ID - Player - Size

let activeTeam = teams.blue;

io.on('connection', socket => {
    console.log('Client connected : ', socket.id);
    socket.broadcast.emit('receive-connection', socket.id);

    socket.on('disconnect', () => {
        const t = teams[Object.keys(teams).find(key => teams[key].player === socket.id)];
        socket.broadcast.emit('receive-disconnect', socket.id);
        if (!t) return;
        t.count = 0;
        t.player = '';
        io.emit('receive-teams', teams);
    })

    socket.on('get-teams', callback => {
        callback(teams);
    })

    socket.on('get-grid', callback => {
        callback(grid);
    })

    socket.on('play', (user, box, callback) => {
        const team = isPlayer(user);
        if (!team) return callback("You're not a player!");
        if (activeTeam != findTeamByName(team)) return callback("It's not your turn!");
        if (isFree(box)) {
            grid[box - 1][0] = 1;
            grid[box - 1][1] = team;
            io.emit('receive-play', box, team);
            toogleActiveTeam();
        } else {
            callback(`You can't play on <b>box ${box}</b>!`);
        }
    })

    socket.on('join-team', (user, teamName, callback) => {
        if (isPlayer(user)) return callback('You already joined a team!');
        const t = findTeamByName(teamName);
        if (t.count == 0) {
            t.count = 1;
            t.player = user;
            io.emit('receive-teams', teams);
        } else {
            callback(`<b>${teamName}</b> is full!`);
        }
    })

    socket.on('send-reset', (user, callback) => {
        if (!isPlayer(user)) return callback("You're not a player, you can't reset the grid!");
        grid = [
            [0, '', ''], [0, '', ''], [0, '', ''],
            [0, '', ''], [0, '', ''], [0, '', ''],
            [0, '', ''], [0, '', ''], [0, '', '']
        ];
        io.emit('receive-init', grid);
    })
})

function isPlayer(user) {
    return Object.keys(teams).find(key => teams[key].player === user);
}

function isFree(box) {
    return grid[box - 1][0] === 0;
}

function findTeamByName(teamName) {
    return teams[Object.keys(teams).find(key => key === teamName)];
}

function toogleActiveTeam() {
    if (activeTeam === teams.blue) {
        activeTeam = teams.red;
    } else {
        activeTeam = teams.blue;
    }
}