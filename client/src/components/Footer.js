import styled from 'styled-components';

const Footer = () => {
    return (
        <Foot>
            <a href="mailto:bug@tictactoe-remastered.com">Report bug</a>
            <span>Made by <a target="_blank" rel="noreferrer" href="https://github.com/misterazix">MisterAzix</a></span>
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