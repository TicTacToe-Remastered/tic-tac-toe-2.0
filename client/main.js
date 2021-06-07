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

const socket = io('http://localhost:3000')
socket.on('connect', () => {
    notyf.success(`You connected with id <b>${socket.id}</b>!`)
})

socket.on('receive-connection', id => {
    notyf.success(`<b>${id}</b> joined the game!`)
})

socket.on('receive-play', (user, box) => {
    notyf.success(`<b>${user}</b> play on <b>box ${box}</b>`)
})

boxes.forEach(box => {
    box.addEventListener('click', e => {
        //console.log("Box : ", e.target.id)
        socket.emit('send-play', socket.id, e.target.id)
    })
});