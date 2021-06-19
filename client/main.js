import { io } from 'socket.io-client';
import { Notyf } from 'notyf';
const notyf = new Notyf({
    duration: 5000,
    position: {
      x: 'right',
      y: 'top'
    }
});
const boxes = document.querySelectorAll('.box');
const teamButtons = document.querySelectorAll('.btn-team');
const resetButton = document.querySelector('.btn-reset');

const socket = io('http://localhost:3000');

/* CONNECTIONS */
socket.on('connect', () => {
    notyf.success(`You connected with id <b>${socket.id}</b>!`);
    socket.emit('get-teams', editTeams);
    socket.emit('get-grid', initGrid);
    socket.emit('get-active', editActive);
});

/* RECEIVE */
socket.on('receive-connection', id => {
    notyf.success(`<b>${id}</b> joined the game!`);
})

socket.on('receive-disconnect', id => {
    notyf.error(`<b>${id}</b> left the game!`);
});

socket.on('receive-teams', teams => {
    editTeams(teams);
});

socket.on('receive-play', (box, team, size) => {
    play(box, team, size);
    /* notyf.success(`<b>${team}</b> play on <b>box ${box}</b>`); */
});

socket.on('receive-init', grid => {
    initGrid(grid);
});

socket.on('receive-active', activeMessage => {
    editActive(activeMessage);
});

socket.on('receive-win', (win, grid) => {
    notyf.success(`<b>${win}</b> win the match!`);
});

socket.on('receive-equality', () => {
    notyf.success(`Equality!`);
});

/* SEND */
boxes.forEach(box => {
    box.addEventListener('click', e => {
        socket.emit('play', socket.id, box.id, function(error) {
            notyf.error(error);
        });
    });
});

teamButtons.forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        socket.emit('join-team', socket.id, e.target.parentElement.id, function(error) {
            notyf.error(error);
        });
    });
});

resetButton.addEventListener('click', e => {
    e.preventDefault();
    socket.emit('send-reset', socket.id, function(error) {
        notyf.error(error);
    });
});

/* FUNCTIONS */
function editTeams(teams) {
    Object.entries(teams).forEach(entry => {
        const [key, value] = entry;
        const el = document.getElementById(key);
        el.querySelector('#place').innerHTML = value.count;
        el.querySelector('#score').innerHTML = value.score;
    });
}

function initGrid(grid) {
    grid.forEach((box, index) => {
        if (box[0] === 1) {
            play(index + 1, box[1]);
        } else {
            boxes[index].innerHTML = "";
        }
    });
}

function editActive(activeMessage) {
    const activeDiv = document.getElementById('activeTeam');
    activeDiv.innerHTML = activeMessage;
}

function play(boxID, team, size = 'medium') {
    const box = document.getElementById(boxID);
    const span = document.createElement('span');
    span.classList.add(size, team);
    box.appendChild(span);
}