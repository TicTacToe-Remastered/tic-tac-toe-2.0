import { Fragment, useEffect, useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import { createGlobalStyle } from 'styled-components';

import Loader from './components/Loader';
import Router from './components/Router';
import Footer from './components/Footer';
import ResponsiveModal from './components/ResponsiveModal';

import socket from './connect';

const App = () => {
    const [connection, setConnection] = useState(false);
    const [responsive, setResponsive] = useState(true);

    useEffect(() => {
        socket.on('connect', () => {
            console.log(`You connected with id ${socket.id}!`);
            setConnection(true);
        });
    }, []);

    useEffect(() => {
        const resize = () => {
            if (window.innerWidth <= (window.innerHeight * 1.4).toFixed() && responsive === false) setResponsive(true);
            if (window.innerWidth > (window.innerHeight * 1.4).toFixed() && responsive === true) setResponsive(false);
        }

        window.addEventListener('load', resize);
        window.addEventListener('resize', resize);
    }, [responsive]);

    return (
        <Fragment>
            <GlobalStyle />
            {responsive && <ResponsiveModal />}
            {connection ? <BrowserRouter><Router /></BrowserRouter> : <Loader />}
            <Footer />
        </Fragment>
    );
}

export default App;

const GlobalStyle = createGlobalStyle`
    :root {
        --background-color: hsl(210, 33%, 99%);
        --background-color-active: hsl(210, 33%, 85%);
        --text-color: hsl(0, 0%, 9%);
        --box-shadow: 0px 0px 16px rgba(23, 23, 23, 0.1);

        --gradient-blue: linear-gradient(180deg, #00D2FF 0%, #3A7BD5 100%);
        --gradient-red: linear-gradient(180deg, #FF512F 0%, #DD2476 100%);
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;

        &::-webkit-scrollbar {
            background-color: var(--background-color);
            width: 1vmin;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 1vmin;
            background: var(--text-color);
        }
    }

    body {
        background-color: var(--background-color);
        color: var(--text-color);
        font-family: Montserrat, Helvetica, sans-serif;
        overflow-x: hidden; 
    }
`