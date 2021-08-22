import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import styled from 'styled-components';

import RoomList from "./RoomList";
import Room from "./Room";

import socket from '../connect';

const RoomRouter = () => {
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        socket.emit('is-logged', function (response) {
            !response && history.push('/');
        });
    }, [history]);

    return (
        <Container>
            {id ? <Room /> : <RoomList />}
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