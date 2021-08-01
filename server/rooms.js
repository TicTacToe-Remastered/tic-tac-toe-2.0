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
        teams: [
            {
                id: 'blue',
                player: null,
                score: 0,
                activePiece: 'medium',
                pieces: {
                    small: 3,
                    medium: 3,
                    large: 3
                }
            },
            {
                id: 'red',
                player: null,
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
    return rooms.find((room) => room.id === id)
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
    const { grid, teams } = getRoom(id);
    grid = [
        [null, null], [null, null], [null, null],
        [null, null], [null, null], [null, null],
        [null, null], [null, null], [null, null]
    ];
    teams.forEach(team => {
        team.pieces = {
            small: 3,
            medium: 3,
            large: 3
        }
    });
}

/**
 * @description Join a room
 * @param  {string} id
 * @param  {string} socket
 * @returns {object}
 */
const joinRoom = (id, socket) => {
    const { teams } = getRoom(id);
    if (!teams) return { error: `Room <strong>${id}</strong> doesn't exist!` };

    const getEmptySlot = (teams) => teams.find(team => team.player === null);
    if (!getEmptySlot(teams)) return { error: 'Room is full!' };

    socket.join(id);
    getEmptySlot(teams).player = socket.id;
    return { success: `${socket.id} successfully join!` };
}

module.exports = { createRoom, removeRoom, getRoom, getRooms, resetRoom, joinRoom };