import { useParams, useHistory } from "react-router-dom";
import styled from 'styled-components';

import Title from '../components/Title';
import RoomList from '../components/RoomList';
import Button from '../components/Button';
import Board from '../components/Board';
import PlayerCard from '../components/PlayerCard';
import PieceSelector from '../components/PieceSelector';

import socket from '../connect';

const Room = () => {
    const { id } = useParams();
    const history = useHistory();

    socket.emit('is-logged', function(response) {
        !response && history.push('/');
    });

    const renderRoomList = () =>
        <Col>
            <Row>
                <Title />
                <RoomList />
                <ButtonContainer>
                    <Button type="button" color="primary">Create Room</Button>
                    <Reload type="button">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sync-alt" className="svg-inline--fa fa-sync-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z"></path>
                        </svg>
                    </Reload>
                </ButtonContainer>
            </Row>
        </Col>;

    const renderRoomBoard = () =>
        <Col>
            <Row>
                <PlayerCard />
                <PieceSelector />
            </Row>
            <Row>
                <Board />
            </Row>
            <Row>
                <PlayerCard />
                <PieceSelector />
            </Row>
        </Col>;

    return (
        <Container>
            {id ? renderRoomBoard() : renderRoomList()}
        </Container>
    );
}

export default Room;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`;

const Col = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 2rem;
`;

const Row = styled.div`
    flex: 25%;
    flex-shrink: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Reload = styled.button`
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    margin-top: 2vmin;
    margin-left: 3vmin;
    transition: transform 0.3s ease;

    svg {
        width: 3.5vmin;
        height: 3.5vmin;
        color: $text-color;
    }

    &:hover {
        transform: scale(1.1);
    }
`;