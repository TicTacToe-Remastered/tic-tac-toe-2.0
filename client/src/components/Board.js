import styled from 'styled-components';

const Board = () => {
    return (
        <Grid>
            <Box id="1"></Box>
            <Box id="2"></Box>
            <Box id="3"></Box>
            <Box id="4"></Box>
            <Box id="5"></Box>
            <Box id="6"></Box>
            <Box id="7"></Box>
            <Box id="8"></Box>
            <Box id="9"></Box>
        </Grid>
    );
}

export default Board;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 16vmin);
    grid-template-rows: repeat(3, 16vmin);
    gap: 1rem;
`;

const Box = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: var(--box-shadow);
    border-radius: 1rem;
`;