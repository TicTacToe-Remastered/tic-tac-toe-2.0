const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const { createUser, removeUser, getUser } = require('./users');
const { createRoom, removeRoom, getRoom, getRooms, resetRoom } = require('./rooms');

const app = express()
    .use(cors())
    .use((req, res) => res.end('Hello world!'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = require('socket.io')(app, {
    cors: {
        origin: "*"
    }
});

let teams = {
    blue: {
        id: 'blue',
        count: 0,
        player: '',
        playerName: '',
        score: 0,
        activePiece: 'medium',
        pieces: {
            small: 3,
            medium: 3,
            large: 3
        }
    },
    red: {
        id: 'red',
        count: 0,
        player: '',
        playerName: '',
        score: 0,
        activePiece: 'medium',
        pieces: {
            small: 3,
            medium: 3,
            large: 3
        }
    }
};

let grid = [
    [null, null], [null, null], [null, null],
    [null, null], [null, null], [null, null],
    [null, null], [null, null], [null, null]
];
//Team - Size

let activeTeam = teams.blue;

io.on('connection', socket => {
    console.log('Client connected : ', socket.id);
    socket.broadcast.emit('receive-connection', socket.id);

    socket.on('login', ({ name }, callback) => {
        const { error, user } = createUser({ id: socket.id, name });

        if (error) return callback(error);
        socket.emit('receive-init-room', getRooms());
        callback();
    });

    socket.on('create-room', callback => {
        const user = getUser(socket.id);
        createRoom(user.name);
        socket.emit('receive-init-room', getRooms()); //temp
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        const t = teams[Object.keys(teams).find(key => teams[key].player === socket.id)];
        socket.broadcast.emit('receive-disconnect', socket.id);
        if (!t) return;
        t.count = 0;
        t.player = '';
        t.playerName = '';
        io.emit('receive-teams', teams);
        console.log(`${socket.id} disconnect!`);
    });

    socket.on('get-teams', callback => {
        callback(teams);
    });

    socket.on('get-grid', callback => {
        callback(grid);
    });

    socket.on('get-active', callback => {
        callback(activeTeam.id);
    });

    socket.on('play', (user, box, callback) => {
        const team = isPlayer(user);
        if (!team) return callback("You're not a player!");
        if (activeTeam != findTeamByName(team)) return callback("It's not your turn!");
        if (!isPieceAvailable(activeTeam)) return callback(`You used all your ${activeTeam.activePiece} pieces!`);
        if (isFree(box)) {
            grid[box - 1][0] = team;
            grid[box - 1][1] = activeTeam.activePiece;
            activeTeam.pieces[activeTeam.activePiece]--;
            io.emit('receive-play', box, team, activeTeam.activePiece);
            io.emit('receive-edit-piece', teams)
            if (checkWin()) {
                io.emit('receive-win', activeTeam.id);
                resetGrid();
                findTeamByName(team).score++;
                io.emit('receive-teams', teams);
            } else if (checkEquality()) {
                resetGrid();
                io.emit('receive-equality');
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
            t.playerName = getUser(user).name;
            io.emit('receive-teams', teams);
            console.log(`${getUser(user).name} join ${teamName} team!`);
        } else {
            callback(`<b>${teamName}</b> is full!`);
        }
    });

    socket.on('send-reset', (user, callback) => {
        if (!isPlayer(user)) return callback("You're not a player, you can't reset the grid!");
        resetGrid();
    });

    socket.on('select-piece', (user, team, item, callback) => {
        const userTeam = isPlayer(user);
        if (!userTeam) return callback("You're not a player!");
        if (userTeam !== team) return;
        findTeamByName(team).activePiece = item;
        io.emit('receive-edit-piece', teams);
    });
});

function isPlayer(user) {
    return Object.keys(teams).find(key => teams[key].player === user);
}

function isFree(box) {
    boxContent = grid[box - 1][1];
    if (boxContent === null) return true;
    else if (boxContent === 'small' && (activeTeam.activePiece === 'medium' || activeTeam.activePiece === 'large')) return true;
    else if (boxContent === 'medium' && activeTeam.activePiece === 'large') return true;
    else return false;
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
    io.emit('receive-active', activeTeam.id);
}

function checkEquality() {
    return grid.filter(g => g[0] !== null).length >= 9;
}

function checkWin() {
    if ((grid[0][0] !== null && grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0]) ||
        (grid[3][0] !== null && grid[3][0] === grid[4][0] && grid[4][0] === grid[5][0]) ||
        (grid[6][0] !== null && grid[6][0] === grid[7][0] && grid[7][0] === grid[8][0]) ||
        (grid[0][0] !== null && grid[0][0] === grid[3][0] && grid[3][0] === grid[6][0]) ||
        (grid[1][0] !== null && grid[1][0] === grid[4][0] && grid[4][0] === grid[7][0]) ||
        (grid[2][0] !== null && grid[2][0] === grid[5][0] && grid[5][0] === grid[8][0]) ||
        (grid[0][0] !== null && grid[0][0] === grid[4][0] && grid[4][0] === grid[8][0]) ||
        (grid[2][0] !== null && grid[2][0] === grid[4][0] && grid[4][0] === grid[6][0])) {
        return true;
    } else {
        return false;
    }
}

function resetGrid() {
    grid = [
        [null, null], [null, null], [null, null],
        [null, null], [null, null], [null, null],
        [null, null], [null, null], [null, null]
    ];
    teams.blue.pieces = {
        small: 3,
        medium: 3,
        large: 3
    }
    teams.red.pieces = {
        small: 3,
        medium: 3,
        large: 3
    }
    io.emit('receive-init', grid);
    io.emit('receive-edit-piece', teams);
}

function isPieceAvailable(activeTeam) {
    return activeTeam.pieces[activeTeam.activePiece] > 0;
}