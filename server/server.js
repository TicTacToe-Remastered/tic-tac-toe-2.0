const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080']
    }
});

let teams = {
    blue: {
        id: 'blue',
        count: 0,
        player: '',
        score: 0
    },
    red: {
        id: 'red',
        count: 0,
        player: '',
        score: 0
    }
};

let grid = [
    [0, '', ''], [0, '', ''], [0, '', ''],
    [0, '', ''], [0, '', ''], [0, '', ''],
    [0, '', ''], [0, '', ''], [0, '', '']
];
//ID - Team - Size

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
    });

    socket.on('get-teams', callback => {
        callback(teams);
    });

    socket.on('get-grid', callback => {
        callback(grid);
    });

    socket.on('get-active', callback => {
        callback(`It's <b>${activeTeam.id}</b> turn!`);
    });

    socket.on('play', (user, box, callback) => {
        const team = isPlayer(user);
        if (!team) return callback("You're not a player!");
        if (activeTeam != findTeamByName(team)) return callback("It's not your turn!");
        if (isFree(box)) {
            grid[box - 1][0] = 1;
            grid[box - 1][1] = team;
            io.emit('receive-play', box, team);
            if (checkEquality()) {
                resetGrid();
                io.emit('receive-equality');
            } else if (checkWin()) {
                io.emit('receive-win', activeTeam.id);
                resetGrid();
                findTeamByName(team).score++;
                io.emit('receive-teams', teams);
            }
            toogleActiveTeam();
        } else {
            callback(`You can't play on <b>box ${box}</b>!`);
        }
    });

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
    });

    socket.on('send-reset', (user, callback) => {
        if (!isPlayer(user)) return callback("You're not a player, you can't reset the grid!");
        resetGrid();
    });
});

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
    io.emit('receive-active', `It's <b>${activeTeam.id}</b> turn!`);
}

function checkEquality() {
    return grid.filter(g => g[1] != '').length >= 9;
}

function checkWin() {
    if ((grid[0][1] != '' && grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1]) ||
    (grid[3][1] != '' && grid[3][1] === grid[4][1] && grid[4][1] === grid[5][1]) ||
    (grid[6][1] != '' && grid[6][1] === grid[7][1] && grid[7][1] === grid[8][1]) ||
    (grid[0][1] != '' && grid[0][1] === grid[3][1] && grid[3][1] === grid[6][1]) ||
    (grid[1][1] != '' && grid[1][1] === grid[4][1] && grid[4][1] === grid[7][1]) ||
    (grid[2][1] != '' && grid[2][1] === grid[5][1] && grid[5][1] === grid[8][1]) ||
    (grid[0][1] != '' && grid[0][1] === grid[4][1] && grid[4][1] === grid[8][1]) ||
    (grid[2][1] != '' && grid[2][1] === grid[4][1] && grid[4][1] === grid[6][1])) {
        return true;
    } else {
        return false;
    }
}

function resetGrid() {
    grid = [
        [0, '', ''], [0, '', ''], [0, '', ''],
        [0, '', ''], [0, '', ''], [0, '', ''],
        [0, '', ''], [0, '', ''], [0, '', '']
    ];
    io.emit('receive-init', grid);
}