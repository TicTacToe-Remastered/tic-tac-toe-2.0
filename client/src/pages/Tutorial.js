import { useHistory } from 'react-router';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import BackArrow from '../icons/BackArrow';

const Tutorial = () => {
    
    const history = useHistory();

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