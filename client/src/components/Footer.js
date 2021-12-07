import { useContext } from 'react';
import styled, { css } from 'styled-components';

import { LanguageContext } from '../libs/context/languageContext';

const Footer = () => {
    const { language, setLanguage } = useContext(LanguageContext);

    const handleClick = (lang) => {
        setLanguage(lang);
    }

    return (
        <Foot>
            <div className="left">
                <a target="_blank" rel="noreferrer" href="https://github.com/MisterAzix/tic-tac-toe-2.0/issues">{language.general.bug}</a>
            </div>
            <div>
                <LanguageBtn active={language.general.play === 'Play'} onClick={() => handleClick('en')}>EN</LanguageBtn>
                /
                <LanguageBtn active={language.general.play === 'Jouer'} onClick={() => handleClick('fr')}>FR</LanguageBtn>
                /
                <LanguageBtn active={language.general.play === 'Lancar'} onClick={() => handleClick('es')}>ES</LanguageBtn>
            </div>
            <div className="right">
                <span>{language.general.copyrights} <a target="_blank" rel="noreferrer" href="https://github.com/misterazix">MisterAzix</a></span>
            </div>
        </Foot>
    );
}

export default Footer;

const Foot = styled.footer`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2vmin 3vmin;
    font-size: 2vmin;

    div {
        flex: 33%;
        display: flex;
        justify-content: center;

        &.left {
            justify-content: flex-start;
        }

        &.right {
            justify-content: flex-end;
        }
    }
    
    a {
        color: ${({ theme }) => theme.text};
    }
`;

const LanguageBtn = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
    margin: 0 4px;
    color: ${({ theme }) => theme.text};

    ${props => props.active && css`
        font-weight: bold;
    `}
`;