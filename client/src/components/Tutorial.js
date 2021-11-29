import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

import Button from '../components/Button';
import Board from '../components/Board';
import PieceSelector from '../components/PieceSelector';

import InfoIcon from '../icons/InfoIcon';
import Cross from '../icons/Cross';

import { LanguageContext } from '../libs/languageContext';

const Tutorial = () => {
    const { language } = useContext(LanguageContext);

    const [index, setIndex] = useState(0);
    const [currentData, setCurrentData] = useState();
    const [tutorial, setTutorial] = useState(false);

    useEffect(() => {
        setCurrentData(language.tutorial[index]);
    }, [index, language]);

    const handleInfo = () => {
        setIndex(0);
        setTutorial(true);
    };
    const handleClose = () => setTutorial(false);
    const increment = () => setIndex((index + 1) % language.tutorial.length);
    const decrement = () => setIndex((index - 1) % language.tutorial.length);

    return (
        <>
            <Info onClick={handleInfo}><InfoIcon /></Info>
            <AnimatePresence exitBeforeEnter>
            {tutorial &&
                    <Background
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, type: "spring" }}
                    >
                        <Card
                            initial={{ x: -500, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 500, opacity: 0 }}
                            transition={{ duration: 0.3, type: "spring" }}
                        >
                            <CardBody>
                                <CrossButton onClick={handleClose}><Cross /></CrossButton>
                                <Demo>
                                    {currentData?.demo_type && (currentData.demo_type === 'grid'
                                        ? <Board grid={currentData.grid} disabled={true} />
                                        : <PieceSelector player={currentData.player} disabled={true} />)}
                                </Demo>
                                <Content>
                                    <h2>{language.general.tutorial} - {currentData?.title}</h2>
                                    <p>{currentData?.content}</p>
                                    <ButtonContainer>
                                        {index !== 0 && <Button onClick={decrement}>{language.general.previous}</Button>}
                                        {index !== (language.tutorial.length - 1)
                                            ? <Button onClick={increment} color="primary">{language.general.next}</Button>
                                            : <Button onClick={handleClose} color="primary">{language.general.play}</Button>}
                                    </ButtonContainer>
                                </Content>
                                <Page>{index + 1}/{language.tutorial.length}</Page>
                            </CardBody>
                        </Card>
                    </Background>}
                </AnimatePresence>
        </>
    );
}

export default Tutorial;

const Background = styled(motion.div)`
    z-index: 101;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Card = styled(motion.div)`
    padding: 8vmin;
    box-shadow: var(--box-shadow);
    border-radius: 2vmin;
    background: var(--background-color);
`;

const CardBody = styled.div`
    position: relative;
    display: flex;
    gap: 4vmin;
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

const Page = styled.span`
    position: absolute;
    left: 50%;
    top: 100%;
    font-size: 2vmin;
    font-weight: bold;
    margin-top: 3vmin;
    transform: translateX(-50%);
`;

const Info = styled.button`
    position: fixed;
    top: 3vmin;
    right: 3vmin;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    margin-top: 2vmin;
    margin-right: 3vmin;
    transition: transform 0.3s ease;

    svg {
        width: 4vmin;
        height: 4vmin;
        color: var(--text-color);
    }

    &:hover {
        transform: scale(1.1);
    }
`;

const CrossButton = styled.button`
    position: absolute;
    left: calc(100% + 2vmin);
    bottom: calc(100% + 2vmin);
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    transition: transform 0.3s ease;

    svg {
        width: 2.5vmin;
        height: 2.5vmin;
        color: var(--text-color);
    }

    &:hover {
        transform: scale(1.1);
    }
`;