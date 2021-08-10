import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import socket from './connect';

socket.on('connect', () => {
    console.log(`You connected with id ${socket.id}!`);
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    );
});

