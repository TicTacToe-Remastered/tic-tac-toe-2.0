const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const { createUser, removeUser, getUser } = require('./users');
const { createRoom, removeRoom, getRoom, getRooms, resetRoom, joinRoom, leaveRoom, getPlayer } = require('./rooms');

const consoleTimestamp = function () {
    const date = new Date();
    return `[${date.getHours() < 10 ? '0' : '' + date.getHours()}:${date.getMinutes() < 10 ? '0' : '' + date.getMinutes()}]`;
}

const app = express()
    .use(cors())
    .use((req, res) => res.end('Hello world!'))
    .listen(PORT, () => console.log(consoleTimestamp(), `>>> Server is running & listening on ${PORT} <<<`));

const io = require('socket.io')(app, {
    cors: {
        origin: "*"
    }
});

io.on('connection', socket => {
    console.log(consoleTimestamp(), 'Client connected : ', socket.id);
    socket.broadcast.emit('receive-connection', socket.id);

    socket.on('is-logged', callback => callback(getUser(socket.id)));

    socket.on('login', ({ name }, callback) => {
        const { error, user } = createUser({ id: socket.id, name });
        if (error) return callback(error);

        socket.emit('receive-init-room', getRooms());
        callback();

        console.log(consoleTimestamp(), `${socket.id} logged in with the username : ${user.name}`);
    });

    socket.on('create-room', callback => {
        const user = getUser(socket.id);
        if (!user) return callback({ error: 'Cannot create a room has guest!' });
        const { error, room } = createRoom(user.name);
        if (error) return callback({ error });

        joinRoom(room.id, socket);
        /* io.to(room.id).emit('receive-teams', room.players);
        io.to(room.id).emit('receive-active', room.activeTeam); */
        callback({ room });

        console.log(consoleTimestamp(), `${user.name} (${socket.id}) create a new room (${room.id})`);
    });

    socket.on('get-room', (callback) => callback(getRooms()));

    socket.on('join-room', (roomId, callback) => {
        const { error, room } = joinRoom(roomId, socket);
        if (error) return callback({ error });

        const { id, activeTeam, grid, players } = room;
        io.to(id).emit('receive-init', grid);
        io.to(id).emit('receive-teams', players);
        io.to(id).emit('receive-active', activeTeam);
        io.to(id).emit('receive-edit-piece', players);
        callback({ room });

        console.log(consoleTimestamp(), `${getUser(socket.id).name} (${socket.id}) join a room (${roomId})`);
    });

    socket.on('get-username', (user, callback) => callback(getUser(user)?.name));

    socket.on('disconnect', () => {
        console.log(consoleTimestamp(), `${socket.id} disconnect!`);

        const user = getUser(socket.id);
        if (!user) return;

        socket.broadcast.emit('receive-disconnect', socket.id);

        if (user.room) {
            leaveRoom(socket.id);
            const room = getRoom(user.room);
            io.to(user.room).emit('receive-teams', room.players);

            if (room.players.filter(player => player.id === null).length >= 2) {
                console.log(consoleTimestamp(), `Room ${room.id} has been deleted (no more players)`);

                removeRoom(user.room);
            }
        }
        removeUser(socket.id);
    });

    socket.on('play', (box, callback) => {
        const { error, player, room } = getPlayer(socket.id);
        if (error) return callback(error);

        if (player.team !== room.activeTeam) return callback("It's not your turn!");
        if (!isPieceAvailable(player)) return callback(`You used all your ${player.activePiece} pieces!`);

        if (isFree(room, player, box)) {
            room.grid[box].unshift([player.team, player.activePiece]);
            player.pieces[player.activePiece]--;
            io.to(room.id).emit('receive-init', room.grid);
            io.to(room.id).emit('receive-edit-piece', room.players);

            if (checkWin(room.grid)) {
                io.to(room.id).emit('receive-win', player.team);
                player.score++;
                io.to(room.id).emit('receive-teams', room.players);
                resetGrid(room);
            } else if (checkEquality(room.grid)) {
                io.to(room.id).emit('receive-equality');
                resetGrid(room);
            }
            toogleActiveTeam(room);
        } else {
            callback(`You can't play on <b>box ${box}</b>!`);
        }
    });

    socket.on('send-reset', (callback) => {
        const { error, player, room } = getPlayer(socket.id);
        if (error) return callback(error);

        resetGrid(room);
    });

    socket.on('select-piece', (team, item, callback) => {
        const { error, player, room } = getPlayer(socket.id);
        if (error) return callback(error);

        if (player.team !== team) return;

        player.activePiece = item;
        io.to(room.id).emit('receive-edit-piece', room.players);
    });
});

function resetGrid(room) {
    const newRoom = resetRoom(room.id);
    io.to(room.id).emit('receive-init', newRoom.grid);
    io.to(room.id).emit('receive-edit-piece', newRoom.players);
}

function isFree(room, player, box) {
    boxContent = room.grid[box][0]?.[1];
    if (!boxContent) return true;
    else if (boxContent === 'small' && (player.activePiece === 'medium' || player.activePiece === 'large')) return true;
    else if (boxContent === 'medium' && player.activePiece === 'large') return true;
    else return false;
}

function toogleActiveTeam(room) {
    room.activeTeam = room.activeTeam === 'blue' ? 'red' : 'blue';
    io.to(room.id).emit('receive-active', room.activeTeam);
}

function checkEquality(grid) {
    return grid.filter(g => !g).length >= 9;
}

function checkWin(grid) {
    if ((grid[0][0] && grid[0][0]?.[0] === grid[1][0]?.[0] && grid[1][0]?.[0] === grid[2][0]?.[0]) ||
        (grid[3][0] && grid[3][0]?.[0] === grid[4][0]?.[0] && grid[4][0]?.[0] === grid[5][0]?.[0]) ||
        (grid[6][0] && grid[6][0]?.[0] === grid[7][0]?.[0] && grid[7][0]?.[0] === grid[8][0]?.[0]) ||
        (grid[0][0] && grid[0][0]?.[0] === grid[3][0]?.[0] && grid[3][0]?.[0] === grid[6][0]?.[0]) ||
        (grid[1][0] && grid[1][0]?.[0] === grid[4][0]?.[0] && grid[4][0]?.[0] === grid[7][0]?.[0]) ||
        (grid[2][0] && grid[2][0]?.[0] === grid[5][0]?.[0] && grid[5][0]?.[0] === grid[8][0]?.[0]) ||
        (grid[0][0] && grid[0][0]?.[0] === grid[4][0]?.[0] && grid[4][0]?.[0] === grid[8][0]?.[0]) ||
        (grid[2][0] && grid[2][0]?.[0] === grid[4][0]?.[0] && grid[4][0]?.[0] === grid[6][0]?.[0])) {
        return true;
    } else {
        return false;
    }
}

function isPieceAvailable(player) {
    return player.pieces[player.activePiece] > 0;
}