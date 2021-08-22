import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import socket from '../connect';

const RoomSelector = forwardRef((props, ref) => {
    const [list, setList] = useState(null);
    const history = useHistory();
    
    useEffect(() => {
        displayRoomSelector();
    }, []);

    const displayRoomSelector = () => {
        socket.emit('get-room', function (rooms) {
            setList(rooms);
        });
    };

    const handleJoin = (e) => {
        socket.emit('join-room', e.target.id, function({ error, room }) {
            error && console.log(error);
            room && history.push(`/room/${room.id}`);
        });
    }

    useImperativeHandle(ref, () => {
        return {
            displayRoomSelector: displayRoomSelector
        };
    });

    return (
        <List>
            {list?.map(room => {
                const { id, name, players } = room;
                const slot = players.filter(player => player.id !== null).length;
                return <Item onClick={handleJoin} id={id} key={id}><span>{name}</span><span>{slot}/{players.length}</span></Item>
            })}
        </List>
    );
});

export default RoomSelector;


const List = styled.ul`
    list-style: none;
    max-height: 50vmin;
    overflow-y: scroll;
    overflow-x: visible;
`;

const Item = styled.li`
    width: 50vmin;
    padding: 1.5vmin 2vmin;
    margin: 2.5vmin;
    border: none;
    outline: none;
    border-radius: 1.5vmin;
    background: var(--background-color);
    box-shadow: var(--box-shadow);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    span {
        font-size: 2vmin;
        font-weight: bold;
        pointer-events: none;
    }
`;