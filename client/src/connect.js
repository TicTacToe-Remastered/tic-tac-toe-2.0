import { io } from 'socket.io-client';

//https://serv-tic-tac-toe.herokuapp.com/
const socket = io(process.env.REACT_APP_SERVER_HOST || 'http://localhost:5000/');

export default socket;