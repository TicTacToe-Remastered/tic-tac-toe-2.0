import { useHistory } from 'react-router';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import Button from '../components/Button';
import Board from '../components/Board';
import PieceSelector from '../components/PieceSelector';

import BackArrow from '../icons/BackArrow';
import { useEffect, useState } from 'react';

import data from '../data/tutorial.json';

const Tutorial = () => {
    const history = useHistory();

    const [index, setIndex] = useState(0);
    const [currentData, setCurrentData] = useState();

    useEffect(() => {
        setCurrentData(data.tutorial[index]);

    }, [index]);

    const handleBack = () => {
        history.push('/room');
    }

    const increment = () => {
        setIndex((index + 1) % data.tutorial.length);
    }

    const decrement = () => {
        setIndex((index - 1) % data.tutorial.length);
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
                            <Demo>
                                {currentData?.demo_type && (currentData.demo_type === 'grid' ? <Board grid={currentData.grid} disabled={true} /> : <PieceSelector player={currentData.player} disabled={true} />)}
                            </Demo>
                            <Content>
                                <h2>Tutorial - {currentData?.title}</h2>
                                <p>{currentData?.content}</p>
                                <ButtonContainer>
                                    {index !== 0 && <Button onClick={decrement}>Previous</Button>}
                                    {index !== (data.tutorial.length - 1) && <Button onClick={increment} color="primary">Next</Button>}
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

const Demo = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 52vmin;
    height: 52vmin;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 2vmin;
    width: 52vmin;

    h2 {
        font-size: 3.2vmin;
    }

    p {
        white-space: pre-line;
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
