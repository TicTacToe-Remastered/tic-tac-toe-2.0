import { useContext } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { motion } from 'framer-motion'

import Title from '../components/Title';
import Icon404 from '../icons/Icon404';
import Button from '../components/Button';

import { LanguageContext } from '../libs/context/languageContext';

const NotFound = () => {
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    }

    return (
        <Container
            initial={{ x: -500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring" }}
        >
            <Col>
                <Row>
                    <Title disableLogo />
                    <Content>
                        <Icon404 />
                        <h2>{language.general.not_found}</h2>
                    </Content>
                    <Button onClick={handleClick} color="primary">{language.general.home}</Button>
                </Row>
            </Col>
        </Container>
    );
}

export default NotFound;

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
    gap: 12vmin;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2vmin;

    svg {
        margin-left: 4vmin;
    }
`;