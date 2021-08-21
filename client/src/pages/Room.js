import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import Board from '../components/Board';
import PlayerCard from '../components/PlayerCard';
import PieceSelector from '../components/PieceSelector';

import BackArrow from '../icons/BackArrow';

import socket from '../connect';

const Room = forwardRef((props, ref) => {
    const history = useHistory();

    const [blue, setBlue] = useState([]);
    const [red, setRed] = useState([]);
    const [active, setActive] = useState('blue');
    const [bluePieces, setBluePiece] = useState([]);
    const [redPieces, setRedPiece] = useState([]);
    const [grid, setGrid] = useState([]);

    useEffect(() => {
        socket.on('receive-teams', (players) => {
            editTeams(players);
        });
    
        socket.on('receive-active', (activeTeam) => {
            editActive(activeTeam);
        });

        socket.on('receive-edit-piece', (players) => {
            editPiece(players);
        });

        socket.on('receive-init', (grid) => {
            editGrid(grid);
        });

        return () => {
            socket.emit('leave-room');
        }
    }, []);

    const handleBack = () => {
        history.push('/room');
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

    useImperativeHandle(ref, () => {
        return {
            editTeams: editTeams,
            editActive: editActive,
            editPiece: editPiece,
            editGrid: editGrid
        };
    });

    return (
        <Col>
            <Back onClick={handleBack}><BackArrow /></Back>
            <Row>
                <PlayerCard player={blue} isActive={active === blue.team} />
                <PieceSelector player={bluePieces} />
            </Row>
            <Row>
                <Board grid={grid} />
            </Row>
            <Row>
                <PlayerCard player={red} isActive={active === red.team} />
                <PieceSelector player={redPieces} />
            </Row>
        </Col>
    );
});

export default Room;

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