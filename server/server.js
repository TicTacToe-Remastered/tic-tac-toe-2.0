require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const { createUser, removeUser, getUser } = require('./users');
const { createRoom, removeRoom, getRoom, getRooms, resetRoom, joinRoom, leaveRoom, getPlayer } = require('./rooms');
const { joinWebhook, roomCreateWebhook, roomJoinWebhook, roomDeleteWebhook, winWebhook } = require('./webhooks');

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
        joinWebhook(socket, user);
    });

    socket.on('create-room', callback => {
        const user = getUser(socket.id);
        if (!user) return callback({ error: 'Cannot create a room has guest!' });
        const { error, room } = createRoom(user.name);
        if (error) return callback({ error });

        joinRoom(room.id, socket);
        callback({ room });

        console.log(consoleTimestamp(), `${user.name} (${socket.id}) create a new room (${room.id})`);
        roomCreateWebhook(socket, user, room);
    });

    socket.on('get-room', (callback) => callback(getRooms()));

    socket.on('join-room', (roomId, callback) => {
        const { error, room } = joinRoom(roomId, socket);
        if (error) return callback({ error });

        callback({ room });

        console.log(consoleTimestamp(), `${getUser(socket.id).name} (${socket.id}) join a room (${roomId})`);
        roomJoinWebhook(socket, getUser(socket.id), room);
    });

    socket.on('init-room', () => {
        const user = getUser(socket.id);
        if (!user || !user.room) return;
        const { id, activeTeam, grid, players } = getRoom(user.room);

        io.to(id).emit('receive-grid', grid);
        io.to(id).emit('receive-teams', players);
        io.to(id).emit('receive-active', activeTeam);
        io.to(id).emit('receive-edit-piece', players);
    });

    socket.on('leave-room', () => leave(getUser(socket.id)?.room, socket));

    socket.on('get-username', (user, callback) => callback(getUser(user)?.name));

    socket.on('disconnect', () => {
        console.log(consoleTimestamp(), `${socket.id} disconnect!`);

        const user = getUser(socket.id);
        if (!user) return;

        socket.broadcast.emit('receive-disconnect', socket.id);

        leave(user.room, socket);
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

            const editBoard = () => {
                io.to(room.id).emit('receive-grid', room.grid);
                io.to(room.id).emit('receive-edit-piece', room.players);
            }

            if (checkWin(room.grid)) {
                player.score++;
                io.to(room.id).emit('receive-win', getUser(socket.id).name);
                io.to(room.id).emit('receive-teams', room.players);
                winWebhook(socket, getUser(socket.id), room);
                setTimeout(() => {
                    resetGrid(room);
                    editBoard();
                }, 2000);
            } else if (checkEquality(room.grid)) {
                io.to(room.id).emit('receive-equality');
                setTimeout(() => {
                    resetGrid(room);
                    editBoard();
                }, 2000);
            }

            editBoard();
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

function leave(id, socket) {
    if (id) {
        leaveRoom(id, socket);
        const room = getRoom(id);
        if (!room) return;

        io.to(id).emit('receive-teams', room.players);

        if (room.players.filter(player => player.id === null).length >= 2) {
            console.log(consoleTimestamp(), `Room ${room.id} has been deleted (no more players)`);
            roomDeleteWebhook(room);

            removeRoom(id);
        }
    }
}

function resetGrid(room) {
    const newRoom = resetRoom(room.id);
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
    return grid.filter(g => g[0]).length >= 9 && grid.filter(g => g[0]?.[1] === 'large').length >= 6;
}

function checkWin(grid) {
    if (grid[0][0] && grid[0][0]?.[0] === grid[1][0]?.[0] && grid[1][0]?.[0] === grid[2][0]?.[0]) {
        grid[0][0][2] = true;
        grid[1][0][2] = true;
        grid[2][0][2] = true;
        return true;
    } else if (grid[3][0] && grid[3][0]?.[0] === grid[4][0]?.[0] && grid[4][0]?.[0] === grid[5][0]?.[0]) {
        grid[3][0][2] = true;
        grid[4][0][2] = true;
        grid[5][0][2] = true;
        return true;
    } else if (grid[6][0] && grid[6][0]?.[0] === grid[7][0]?.[0] && grid[7][0]?.[0] === grid[8][0]?.[0]) {
        grid[6][0][2] = true;
        grid[7][0][2] = true;
        grid[8][0][2] = true;
        return true;
    } else if (grid[0][0] && grid[0][0]?.[0] === grid[3][0]?.[0] && grid[3][0]?.[0] === grid[6][0]?.[0]) {
        grid[0][0][2] = true;
        grid[3][0][2] = true;
        grid[6][0][2] = true;
        return true;
    } else if (grid[1][0] && grid[1][0]?.[0] === grid[4][0]?.[0] && grid[4][0]?.[0] === grid[7][0]?.[0]) {
        grid[1][0][2] = true;
        grid[4][0][2] = true;
        grid[7][0][2] = true;
        return true;
    } else if (grid[2][0] && grid[2][0]?.[0] === grid[5][0]?.[0] && grid[5][0]?.[0] === grid[8][0]?.[0]) {
        grid[2][0][2] = true;
        grid[5][0][2] = true;
        grid[8][0][2] = true;
        return true;
    } else if (grid[0][0] && grid[0][0]?.[0] === grid[4][0]?.[0] && grid[4][0]?.[0] === grid[8][0]?.[0]) {
        grid[0][0][2] = true;
        grid[4][0][2] = true;
        grid[8][0][2] = true;
        return true;
    } else if (grid[2][0] && grid[2][0]?.[0] === grid[4][0]?.[0] && grid[4][0]?.[0] === grid[6][0]?.[0]) {
        grid[2][0][2] = true;
        grid[4][0][2] = true;
        grid[6][0][2] = true;
        return true;
    } else {
        return false;
    }
}

function isPieceAvailable(player) {
    return player.pieces[player.activePiece] > 0;
}