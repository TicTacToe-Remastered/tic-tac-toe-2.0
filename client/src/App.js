import { useEffect, useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from 'styled-components';

import Loader from './components/Loader';
import Router from './components/Router';
import Footer from './components/Footer';
import ResponsiveModal from './components/ResponsiveModal';
import Settings from './components/Settings';

import LanguageProvider from './libs/context/languageContext';
import { GlobalStyles } from './libs/GlobalStyles';
import { useDarkMode } from './libs/hook/useDarkMode';
import { lightTheme, darkTheme } from './libs/Theme';

import socket from './connect';

const App = () => {
    const [connection, setConnection] = useState(false);
    const [responsive, setResponsive] = useState(true);
    const [theme, themeToggler, mountedComponent] = useDarkMode();
    const themeMode = theme === 'light' ? lightTheme : darkTheme;

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

    if (!mountedComponent) return <div />
    return (
        <ThemeProvider theme={themeMode}>
            <LanguageProvider>
                <GlobalStyles />
                <Settings themeToggler={themeToggler} />
                {responsive && <ResponsiveModal />}
                {connection ? <BrowserRouter><Router /></BrowserRouter> : <Loader />}
                <Footer />
            </LanguageProvider>
        </ThemeProvider>
    );
}

export default App;