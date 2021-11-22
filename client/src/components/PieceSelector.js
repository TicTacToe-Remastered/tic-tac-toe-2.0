import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimateSharedLayout } from 'framer-motion';

import socket from '../connect';

const PieceSelector = ({ player, disabled }) => {
    const [team, setTeam] = useState('blue');
    const [pieces, setPieces] = useState({});
    const [activePiece, setActivePiece] = useState('medium');

    useEffect(() => {
        setTeam(player.team);
        setPieces(player.pieces);
        setActivePiece(player.activePiece);
    }, [player]);

    const handlePiece = (e) => {
        socket.emit('select-piece', team, e.target.id, function (error) {
            error && console.log(error);
        });
    }

    return (
        <Selector id={team}>
            <AnimateSharedLayout>
                {pieces && Object.keys(pieces).map((key) => (
                    <PieceItem onClick={handlePiece} className={key === activePiece && 'active'} id={key} key={key} disabled={disabled}>
                        <div className="piece-item-circle"></div>
                        <div className="piece-item-size">{key}</div>
                        <div className="piece-item-number">x{pieces[key]}</div>
                        {key === activePiece && (
                            <SelectedPiece
                                layoutId="selected"
                            />
                        )}
                    </PieceItem>
                ))}
            </AnimateSharedLayout>
        </Selector>
    );
}

export default PieceSelector;

const Selector = styled.ul`
    ${props => props.id === 'blue' && css`
        --gradient-color: linear-gradient(180deg, #00D2FF 0%, #3A7BD5 100%);
    `}

    ${props => props.id === 'red' && css`
        --gradient-color: linear-gradient(180deg, #FF512F 0%, #DD2476 100%);
    `}
`;

const SelectedPiece = styled(motion.div)`
    width: 100%;
    height: 100%;
    border-radius: 2vmin;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    background: var(--background-color-active);
`;

const PieceItem = styled.li`
    position: relative;
    border-radius: 2vmin;
    padding: 16px 24px;
    box-shadow: var(--box-shadow);
    display: flex;
    align-items: center;
    width: 32vmin;
    margin: 16px 0;
    cursor: pointer;

    ${props => props.disabled && css`
        pointer-events: none;
    `}

    /* &.active {
        background: var(--background-color-active);

        .piece-item-circle {
            &::after {
                background: var(--background-color-active);
            }
        }
    } */

    .piece-item-circle {
        position: relative;
        width: 3vmin;
        height: 3vmin;
        padding: 0.3vmin;
        border-radius: 50%;
        margin-right: 1.5vmin;
        box-shadow: var(--box-shadow);
        background: var(--gradient-color);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: destination-out;
        pointer-events: none;
    }

    /* .piece-item-circle {
        position: relative;
        width: 3vmin;
        height: 3vmin;
        border-radius: 3vmin;
        margin-right: 1.5vmin;
        box-shadow: var(--box-shadow);
        background: var(--gradient-color);
        pointer-events: none;

        &::after {
            content: "";
            position: absolute;
            background: var(--background-color);
            inset: 0;
            margin: 0.3vmin;
            border-radius: 3vmin;
        }
    } */

    .piece-item-size,
    .piece-item-number {
        font-size: 2vmin;
        font-weight: bold;
        pointer-events: none;
    }
    
    .piece-item-size {
        text-transform: capitalize;
    }
    
    .piece-item-number {
        margin-left: auto;
    }
`;