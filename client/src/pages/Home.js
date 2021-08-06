import styled from 'styled-components';

import Title from '../components/Title';
import LoginForm from '../components/LoginForm';

const Home = () => {
    return (
        <Container>
            <Col>
                <Row>
                    <Title />
                    <LoginForm />
                </Row>
            </Col>
        </Container>
    );
}

export default Home;

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