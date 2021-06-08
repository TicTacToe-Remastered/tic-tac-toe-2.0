import { io } from 'socket.io-client';
import { Notyf } from 'notyf';
const notyf = new Notyf({
    duration: 5000,
    position: {
      x: 'right',
      y: 'top'
    }
});
const boxes = document.querySelectorAll('.box')
const teamButtons = document.querySelectorAll('.btn-team')

const socket = io('http://localhost:3000')

/* CONNECTIONS */
socket.on('connect', () => {
    notyf.success(`You connected with id <b>${socket.id}</b>!`)
    socket.emit('get-teams', editTeams)
})

/* RECEIVE */
socket.on('receive-connection', id => {
    notyf.success(`<b>${id}</b> joined the game!`)
})

socket.on('receive-disconnect', id => {
    notyf.error(`<b>${id}</b> left the game!`)
})

socket.on('receive-play', (user, box) => {
    notyf.success(`<b>${user}</b> play on <b>box ${box}</b>`)
})

socket.on('receive-teams', teams => {
    editTeams(teams)
})

/* SEND */
teamButtons.forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault()
        socket.emit('join-team', socket.id, e.target.parentElement.id, function(error) {
            notyf.error(error)
        })
    })
})

boxes.forEach(box => {
    box.addEventListener('click', e => {
        socket.emit('play', socket.id, e.target.id)
    })
});

/* FUNCTIONS */
function editTeams(teams) {
    Object.entries(teams).forEach(entry => {
        const [key, value] = entry
        const el = document.getElementById(key)
        el.querySelector('span').innerHTML = value.count
    });
}