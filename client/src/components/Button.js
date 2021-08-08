import styled, { css } from 'styled-components';

const Button = ({ children, onClick, type, color}) => {
    return (
        <Btn onClick={onClick} type={type} color={color}>{children}</Btn>
    );
}

export default Button;

const Btn = styled.button`
    border: none;
    outline: none;
    cursor: pointer;
    padding: 1vmin 3vmin;
    border-radius: 1vmin;
    box-shadow: var(--box-shadow);
    font-size: 2vmin;
    font-weight: bold;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.1);
    }

    ${props => props.color === 'primary' && css`
        background: linear-gradient(180deg, #FF512F 0%, #DD2476 100%);
        color: hsl(210, 33%, 99%);
        margin-top: 2vmin;
    `}
`