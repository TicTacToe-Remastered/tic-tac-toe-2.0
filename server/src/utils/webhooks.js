const axios = require('axios');
const { DISCORD_WEBHOOK_JOIN, DISCORD_WEBHOOK_ROOM, DISCORD_WEBHOOK_WIN } = process.env;

const joinWebhook = (socket, user) => {
    const params = {
        content: `**${socket.id}** logged in with the username : **${user.name}**`
    }

    sendWebhook(DISCORD_WEBHOOK_JOIN, params);
}

const roomCreateWebhook = (socket, user, room) => {
    const params = {
        content: `**${user.name} (${socket.id})** create a new room **(${room.id})**`
    }

    sendWebhook(DISCORD_WEBHOOK_ROOM, params);
}

const roomJoinWebhook = (socket, user, room) => {
    const params = {
        content: `**${user.name} (${socket.id})** join a room **(${room.id})**`
    }

    sendWebhook(DISCORD_WEBHOOK_ROOM, params);
}

const roomDeleteWebhook = (room) => {
    const params = {
        content: `Room **${room.id}** has been deleted (no more players)`
    }

    sendWebhook(DISCORD_WEBHOOK_ROOM, params);
}

const winWebhook = (socket, user, room) => {
    const params = {
        content: `**${user.name} (${socket.id})** win the match in room **${room.id}**`
    }

    sendWebhook(DISCORD_WEBHOOK_WIN, params);
}

const sendWebhook = (url, params) => axios.post(url, params);

module.exports = { joinWebhook, roomCreateWebhook, roomJoinWebhook, roomDeleteWebhook, winWebhook };