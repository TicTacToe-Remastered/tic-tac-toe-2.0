import { useHistory } from 'react-router';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

import Button from '../components/Button';

import BackArrow from '../icons/BackArrow';
import { useEffect, useState } from 'react';

const Tutorial = () => {
    const history = useHistory();
    const [grid, setGrid] = useState([]);

    useEffect(() => {
        setGrid([
            [], [['red','large']], [['blue','large']],
            [], [['blue','large']], [],
            [['red','large']], [], [['blue','large']]
        ]);
    }, []);

    const handleBack = () => {
        history.push('/room');
    }

    return (
        <>
            <Back onClick={handleBack}><BackArrow /></Back>
            <Container
                initial={{ x: -500, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 500, opacity: 0 }}
                transition={{ duration: 0.3, type: "spring" }}
            >
                <Col>
                    <Row>
                        <Card>
                            <Grid>
                                {grid?.map((box, index) => {
                                    let isWin = box?.[2];
                                    return <Box key={index} active={isWin}>
                                        {box?.map((circle, i) => circle && <Circle size={circle[1]} team={circle[0]} key={i} />)}
                                    </Box>
                                })}
                            </Grid>
                            <Content>
                                <h2>Tutorial - The principle</h2>
                                <p>
                                    Like the original version, the goal of TicTacToe 2.0 is to line up 3 symbols horizontally,
                                    vertically or diagonally before your opponent,
                                    but the first thing that changes here is that you don't have to line up 3 identical symbols,
                                    but 3 symbols of the same color.
                                    <br /><br />
                                    Each player plays with circles and each has his own color,
                                    for example: blue for one and red for the other.
                                    The game ends when one of the players has aligned 3 symbols
                                    or when no more combinations are possible. Then it’s a tie.
                                </p>
                                <ButtonContainer>
                                    <Button>Previous</Button>
                                    <Button color="primary">Next</Button>
                                </ButtonContainer>
                            </Content>
                        </Card>
                    </Row>
                </Col>
            </Container>
        </>
    );
}

export default Tutorial;

const Container = styled(motion.div)`
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

const Card = styled.div`
    display: flex;
    gap: 4vmin;
    padding: 8vmin;
    box-shadow: var(--box-shadow);
    border-radius: 2vmin;
`;

const Grid = styled.ul`
    display: grid;
    grid-template-columns: repeat(3, 16vmin);
    grid-template-rows: repeat(3, 16vmin);
    gap: 2vmin;
`;

const Box = styled.li`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: var(--box-shadow);
    border-radius: 2vmin;

    ${props => props.active && css`
        background-color: var(--background-color-active);
    `}
`;

const Circle = styled.span`
    position: absolute;
    border-radius: 50%;
    padding: 0.3vmin;
    background: var(--gradient-color);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: destination-out;
    user-select: none;
    pointer-events: none;

    ${props => props.size === 'small' && css`
        height: 6vmin;
        width: 6vmin;
    `}

    ${props => props.size === 'medium' && css`
        height: 9vmin;
        width: 9vmin;
    `}

    ${props => props.size === 'large' && css`
        height: 12vmin;
        width: 12vmin;
    `}

    ${props => props.team === 'blue' && css`
        background: var(--gradient-blue);
    `}

    ${props => props.team === 'red' && css`
        background: var(--gradient-red);
    `}
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2vmin;
    width: 52vmin;
    justify-content: flex-start;
    align-items: flex-start;

    h2 {
        font-size: 3.2vmin;
    }

    p {
        font-size: 2vmin;
        max-height: 40vmin;
        overflow-y: scroll;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 2vmin;
    margin-top: auto;
    margin-left: auto;
`;