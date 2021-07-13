import.meta.env;
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
const playerContainers = document.querySelectorAll('.player-container');
const playerCards = document.querySelectorAll('.player-card');
const resetButton = document.querySelector('.btn-reset');
const pieceSelectorItems = document.querySelectorAll('.pieceItem');

const socket = io(`${__SNOWPACK_ENV__.SNOWPACK_PUBLIC_SERV_HOST}:${__SNOWPACK_ENV__.SNOWPACK_PUBLIC_SERV_PORT}`);

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
});

socket.on('receive-piece', (team, piecesData) => {
    const pieces = document.querySelectorAll('.circle.team');
    pieces.forEach(piece => {
        piece.addEventListener('click', () => {
            notyf.success(`${piece.innerHTML} was pressed`);
        });
    });
});

socket.on('receive-init', grid => {
    initGrid(grid);
});

socket.on('receive-active', activeTeam => {
    editActive(activeTeam);
});

socket.on('receive-win', (win, grid) => {
    notyf.success(`<b>${win}</b> win the match!`);
});

socket.on('receive-equality', () => {
    notyf.success(`Equality!`);
});

socket.on('receive-edit-piece', teams => {
    editPieceSelector(teams);
});

/* SEND */
boxes.forEach(box => {
    box.addEventListener('click', e => {
        socket.emit('play', socket.id, box.id, function (error) {
            notyf.error(error);
        });
    });
});

playerCards.forEach(card => {
    card.addEventListener('click', e => {
        e.preventDefault();
        socket.emit('join-team', socket.id, card.closest('.player-container').id, function (error) {
            notyf.error(error);
        });
    });
});

resetButton?.addEventListener('click', e => {
    e.preventDefault();
    socket.emit('send-reset', socket.id, function (error) {
        notyf.error(error);
    });
});

pieceSelectorItems.forEach(item => {
    item.addEventListener('click', e => {
        socket.emit('select-piece', socket.id, item.closest('.player-container').id, item.id, function (error) {
            notyf.error(error);
        });
    });
});

/* FUNCTIONS */
function editTeams(teams) {
    Object.entries(teams).forEach(entry => {
        const [key, value] = entry;
        const el = document.getElementById(key);
        if (!el) return;
        el.querySelector('.player-name').innerHTML = value.player ? value.player : 'Waiting for player...';
        el.querySelector('.player-score').innerHTML = value.score;
    });
}

function initGrid(grid) {
    grid.forEach((box, index) => {
        if (box[0]) {
            play(index + 1, box[0], box[1]);
        } else {
            boxes[index].innerHTML = "";
        }
    });
}

function editActive(activeTeam) {
    playerContainers.forEach(container => {
        if (container.id === activeTeam) container.classList.add('active-player');
        else container.classList.remove('active-player');
    });
    const activeTeamContainer = document.getElementById(activeTeam);
    activeTeamContainer
}

function play(boxID, team, size = 'medium') {
    const box = document.getElementById(boxID);
    const span = document.createElement('span');
    span.classList.add(size, team);
    box.insertAdjacentElement('afterbegin', span);
}

function editPieceSelector(teams) {
    Object.entries(teams).forEach(entry => {
        const [key, value] = entry;
        const el = document.querySelector(`#${key} .pieceSelector`);
        if (!el) return;
        el.querySelectorAll('.pieceItem').forEach(item => {
            const span = item.querySelector('.piece-item-number');
            span.innerHTML = `x${value.pieces[item.id]}`;
            value.activePiece === item.id ? item.classList.add('active') : item.classList.remove('active');
            if (value.pieces[item.id] <= 0) span.classList.add('disabled');
        });
    });
}