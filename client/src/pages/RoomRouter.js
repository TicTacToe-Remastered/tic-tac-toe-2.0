import { useRef, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import styled from 'styled-components';

import RoomList from "./RoomList";
import Room from "./Room";

import socket from '../connect';

const RoomRouter = () => {
    const { id } = useParams();
    const history = useHistory();
    const roomRef = useRef(null);

    useEffect(() => {
        socket.emit('is-logged', function (response) {
            !response && history.push('/');
        });
    }, [history]);

    const editTeams = (players) => {
        roomRef.current.editTeams(players);
    }

    const editActive = (activeTeam) => {
        roomRef.current.editActive(activeTeam);
    }

    const editPiece = (players) => {
        roomRef.current.editPiece(players);
    }

    const editGrid = (grid) => {
        roomRef.current.editGrid(grid);
    }

    return (
        <Container>
            {id ? <Room ref={roomRef} /> : <RoomList setTeam={editTeams} setActive={editActive} setPiece={editPiece} setGrid={editGrid} />}
        </Container>
    );
}

export default RoomRouter;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`;