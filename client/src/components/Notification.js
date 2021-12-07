import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

const Notification = ({ children }) => {
    return (
        <>
            <Background
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
            />
            <Notif>
                <div>
                    <Span
                        initial={{ x: 1000, opacity: 0 }}
                        animate={{ x: 25, opacity: 1 }}
                        exit={{ x: -1000, opacity: 0 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        color="blue"
                    />
                    <Message
                        initial={{ y: 25, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 25, opacity: 0 }}
                        color="blue"
                    >
                        {children}
                    </Message>
                    <Span
                        initial={{ x: -1000, opacity: 0 }}
                        animate={{ x: -25, opacity: 1 }}
                        exit={{ x: 1000, opacity: 0 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        color="red"
                    />
                </div>
            </Notif>
        </>
    );
}

export default Notification;

const Background = styled(motion.div)`
    z-index: 99;
    position: fixed;
    inset: 0;
    background: ${({ theme }) => theme.text};
    opacity: 0.5;
`;

const Notif = styled.div`
    z-index: 100;
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 4vmin;
`;

const Span = styled(motion.div)`
    height: 8px;
    width: 80%;
    border-radius: 8px;
    margin: 16px auto;
    background: #FFFFFF;

    ${props => props.color === 'blue' && css`
        background: linear-gradient(to left, #00D2FF 0%, #3A7BD5 100%);
    `}

    ${props => props.color === 'red' && css`
        background: linear-gradient(to right, #FF512F 0%, #DD2476 100%);
    `}
`;

const Message = styled(motion.div)`
    font-size: 4vmin;
    font-weight: bold;
    color: ${({ theme }) => theme.body};
`;