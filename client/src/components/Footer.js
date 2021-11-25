import styled, { css } from 'styled-components';

import useLanguage from '../libs/useLanguage';

const Footer = () => {
    const [language, setLanguage] = useLanguage('en');
    
    const handleClick = (lang) => {
        setLanguage(lang);
        console.log(language);
    }

    return (
        <Foot>
            <a target="_blank" rel="noreferrer" href="https://github.com/MisterAzix/tic-tac-toe-2.0/issues">{language.general.bug}</a>
            <div>
                <LanguageBtn active={language.general.play === 'Play'} onClick={() => handleClick('en')}>EN</LanguageBtn>
                /
                <LanguageBtn active={language.general.play === 'Jouer'} onClick={() => handleClick('fr')}>FR</LanguageBtn>
            </div>
            <span>{language.general.copyrights} <a target="_blank" rel="noreferrer" href="https://github.com/misterazix">MisterAzix</a></span>
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
    
    a {
        color: var(--text-color);
    }
`;

const LanguageBtn = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
    margin: 0 4px;

    ${props => props.active && css`
        font-weight: bold;
    `}
`;