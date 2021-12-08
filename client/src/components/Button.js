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
    margin-top: 2vmin;
    border-radius: 1vmin;
    background: ${({ theme }) => theme.cardBackground};
    box-shadow: ${({ theme }) => theme.boxShadow};
    color: ${({ theme }) => theme.text};
    font-size: 2vmin;
    font-weight: bold;
    transition: transform ${({ theme }) => theme.transition};
    transition: background ${({ theme }) => theme.transition}, box-shadow ${({ theme }) => theme.transition};

    &:hover {
        transform: scale(1.1);
    }

    ${props => props.color === 'primary' && css`
        background: ${({ theme }) => theme.gradientRedRight};
        color: hsl(210, 33%, 99%);
    `}
`