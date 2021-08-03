const { getUser } = require('./users');

const rooms = [];

/**
 * @description Create a new room
 * @param  {object} socket
 * @returns {object}
 */
const createRoom = (name) => {

    if (!name) return { error: 'Username is required to create a room.' };

    const genRoomID = () => Math.random().toString(36).toUpperCase().substr(2, 6);
    /* const genRoomName = (name) => `${name.charAt(0).toUpperCase() + name.toLowerCase()}'s room`; */
    const genRoomName = (name) => `${name}'s room`;

    const room = {
        id: genRoomID(),
        name: genRoomName(name),
        activeTeam: 'blue',
        players: [
            {
                id: null,
                team: 'blue',
                score: 0,
                activePiece: 'medium',
                pieces: {
                    small: 3,
                    medium: 3,
                    large: 3
                }
            },
            {
                id: null,
                team: 'red',
                score: 0,
                activePiece: 'medium',
                pieces: {
                    small: 3,
                    medium: 3,
                    large: 3
                }
            }
        ],
        grid: [
            [null, null], [null, null], [null, null],
            [null, null], [null, null], [null, null],
            [null, null], [null, null], [null, null]
        ]
    }

    rooms.push(room);

    return { room };
}

/**
 * @description Remove a room
 * @param  {string} id
 * @returns {array}
 */
const removeRoom = (id) => {
    const index = room.findIndex((room) => room.id === id);
    if (index !== -1) return rooms.splice(index, 1)[0];
}

/**
 * @description Get room data
 * @param  {string} id
 * @returns {object}
 */
const getRoom = (id) => {
    return rooms.find((room) => room.id === id);
}

/**
 * @description Get all rooms
 * @returns {array}
 */
const getRooms = () => {
    return rooms;
}

/**
 * @description Reset a room
 * @returns {undefined}
 */
const resetRoom = (id) => {
    const { grid, players } = getRoom(id);
    grid = [
        [null, null], [null, null], [null, null],
        [null, null], [null, null], [null, null],
        [null, null], [null, null], [null, null]
    ];
    players.forEach(player => {
        player.pieces = {
            small: 3,
            medium: 3,
            large: 3
        }
    });
}

/**
 * @description Get player
 * @param  {string} id Room id
 * @param  {string} player Player id
 * @returns {}
 */
const getPlayer = (id, playerId) => {
    const { players } = getRoom(id) || { players: null };
    if (!players) return { error: `Room <strong>${id}</strong> doesn't exist!` };

    return players.find(player => player.id === playerId);
}

/**
 * @description Join a room
 * @param  {string} id
 * @param  {string} socket
 * @returns {object}
 */
const joinRoom = (id, socket) => {
    const { players } = getRoom(id) || { players: null };
    if (!players) return { error: `Room <strong>${id}</strong> doesn't exist!` };

    const getEmptySlot = (players) => players.find(player => player.id === null);
    if (!getEmptySlot(players)) return { error: 'Room is full!' };

    socket.join(id);
    getUser(socket.id).room = id;
    getEmptySlot(players).id = socket.id;
    return { success: `${socket.id} successfully join!` };
}

/**
 * @description Leave a room
 * @param  {string} id Room id
 * @param  {string} player Player id
 * @returns {}
 */
const leaveRoom = (id, playerId) => {
    const player = getPlayer(id, playerId);
    if (player) player.id = null;
}

module.exports = { createRoom, removeRoom, getRoom, getRooms, resetRoom, getPlayer, joinRoom, leaveRoom };