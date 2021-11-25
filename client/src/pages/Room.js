import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import Board from '../components/Board';
import PlayerCard from '../components/PlayerCard';
import PieceSelector from '../components/PieceSelector';
import Notification from '../components/Notification';

import BackArrow from '../icons/BackArrow';

import socket from '../connect';

const Room = () => {
    const navigate = useNavigate();

    const [blue, setBlue] = useState([]);
    const [red, setRed] = useState([]);
    const [active, setActive] = useState('blue');
    const [bluePieces, setBluePiece] = useState([]);
    const [redPieces, setRedPiece] = useState([]);
    const [grid, setGrid] = useState([]);

    const [notif, setNotif] = useState('');

    useEffect(() => {
        socket.emit('is-logged', function (response) {
            !response && navigate('/');
        });
    }, [navigate]);

    useEffect(() => {
        socket.emit('init-room');

        socket.on('receive-teams', (players) => {
            editTeams(players);
        });

        socket.on('receive-active', (activeTeam) => {
            editActive(activeTeam);
        });

        socket.on('receive-edit-piece', (players) => {
            editPiece(players);
        });

        socket.on('receive-grid', (grid) => {
            editGrid(grid);
        });

        socket.on('receive-win', (player) => {
            setNotif(`${player} won the game!`);
        });

        socket.on('receive-equality', () => {
            setNotif('Equality!');
        });

        return () => {
            socket.emit('leave-room');
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => setNotif(''), 2000);

        return () => {
            clearTimeout(timeout);
        }
    }, [notif]);

    const handleBack = () => {
        navigate('/room');
    }

    const editTeams = (players) => {
        setBlue(players[0]);
        setRed(players[1]);
    }

    const editActive = (activeTeam) => {
        setActive(activeTeam);
    }

    const editPiece = (players) => {
        setBluePiece(players[0]);
        setRedPiece(players[1]);
    }

    const editGrid = (grid) => {
        setGrid(grid);
    }

    /* const handleNotif = () => {
        setNotif(true);
        setTimeout(() => {
            setNotif(false);
        }, 1000);
    } */

    return (
        <>
            <AnimatePresence>{notif && <Notification>{notif}</Notification>}</AnimatePresence>
            <Back onClick={handleBack}><BackArrow /></Back>
            <Container>
                <Col
                    initial={{ x: -500, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 500, opacity: 0 }}
                    transition={{ duration: 0.3, type: "spring" }}
                >
                    <Row>
                        <PlayerCard player={blue} isActive={active === blue.team} />
                        <PieceSelector player={bluePieces} />
                    </Row>
                    <Row>
                        <Board grid={grid} />
                        {/* <button onClick={handleNotif}>SEND NOTIF</button> */}
                    </Row>
                    <Row>
                        <PlayerCard player={red} isActive={active === red.team} />
                        <PieceSelector player={redPieces} />
                    </Row>
                </Col>
            </Container>
        </>
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

const Col = styled(motion.div)`
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

const Back = styled.button`
    position: fixed;
    top: 3vmin;
    left: 3vmin;
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
        color: var(--text-color);
    }

    &:hover {
        transform: scale(1.1);
    }
`;