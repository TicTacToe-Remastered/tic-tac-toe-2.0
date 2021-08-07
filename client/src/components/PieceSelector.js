import styled from 'styled-components';

const PieceSelector = () => {
    return (
        <Selector>
            <PieceItem>
                <div className="piece-item-circle"></div>
                <div className="piece-item-size">Small</div>
                <div className="piece-item-number">x3</div>
            </PieceItem>
            <PieceItem>
                <div className="piece-item-circle"></div>
                <div className="piece-item-size">Medium</div>
                <div className="piece-item-number">x3</div>
            </PieceItem>
            <PieceItem>
                <div className="piece-item-circle"></div>
                <div className="piece-item-size">Large</div>
                <div className="piece-item-number">x3</div>
            </PieceItem>
        </Selector>
    );
}

export default PieceSelector;

const Selector = styled.ul``;

const PieceItem = styled.li`
    --gradient-color: linear-gradient(180deg, #00D2FF 0%, #3A7BD5 100%);
    border-radius: 1rem;
    padding: 16px 24px;
    box-shadow: var(--box-shadow);
    display: flex;
    align-items: center;
    width: 32vmin;
    margin: 16px 0;
    cursor: pointer;

    &.active {
        background: var(--background-color-active);

        .piece-item-circle {
            &::after {
                background: var(--background-color-active);
            }
        }
    }

    .piece-item-circle {
        position: relative;
        width: 3vmin;
        height: 3vmin;
        border-radius: 3vmin;
        margin-right: 1.5vmin;
        background: var(--gradient-color);

        &::after {
            content: "";
            position: absolute;
            background: var(--background-color);
            inset: 0;
            margin: 0.3vmin;
            border-radius: 3vmin;
        }
    }

    .piece-item-size,
    .piece-item-number {
        font-size: 2vmin;
        font-weight: bold;
    }

    .piece-item-number {
        margin-left: auto;
    }
`;