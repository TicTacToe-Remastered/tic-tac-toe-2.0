import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;

        &::-webkit-scrollbar {
            background-color: ${({ theme }) => theme.body};
            width: 1vmin;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 1vmin;
            background: ${({ theme }) => theme.text};
        }
    }

    body {
        background-color: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
        font-family: Montserrat, Helvetica, sans-serif;
        overflow-x: hidden;
        transition: all 0.3s ease;
    }
`;