import { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';

import Button from './Button';

import { LanguageContext } from '../libs/context/languageContext';

import socket from '../connect';

const LoginForm = () => {
    const { language } = useContext(LanguageContext);

    const [name, setName] = useState('');
    const navigate = useNavigate();
    
    const formSubmit = (e) => {
        e.preventDefault();
        
        socket.emit('login', { name }, function (error) {
            if (error) return;
            navigate('/room');
        });
    };

    return (
        <Form onSubmit={formSubmit} id="login-form">
            <InputGroup>
                <label htmlFor="username">{language.general.username}</label>
                <input onChange={event => setName(event.target.value)} type="text" id="username" placeholder="John Doe" maxLength="42" required />
            </InputGroup>
            <Button type="submit" color="primary">{language.general.login}</Button>
        </Form>
    );
}

export default LoginForm;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin: 2.5vmin 0;

    label {
        font-size: 2.5vmin;
        font-weight: bold;
        margin-bottom: 1vmin;
        margin-left: 1vmin;
    }

    input {
        font-size: 2vmin;
        width: 50vmin;
        padding: 1.5vmin 2vmin;
        border: none;
        outline: none;
        border-radius: 1.5vmin;
        background: ${({ theme }) => theme.cardBackground};
        box-shadow: ${({ theme }) => theme.boxShadow};
        transition: background ${({ theme }) => theme.transition}, box-shadow ${({ theme }) => theme.transition};
    }
`;