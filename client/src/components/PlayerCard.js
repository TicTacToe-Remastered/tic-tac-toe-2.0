import styled from 'styled-components';

const PlayerCard = () => {
    const index = 1;
    const name = 'MisterAzix' || 'Waiting for player...';
    const score = 0;

    return (
        <Card>
            <div className="player-logo">
                {/* <i className="fas fa-chevron-right"></i>
                <i className="fas fa-chevron-left"></i> */}
            </div>
            <div className="player-number">Player {index}</div>
            <div className="player-name">{name}</div>
            <div className="player-score">{score}</div>
        </Card>
    );
}

export default PlayerCard;

const Card = styled.div`
    --gradient-color: linear-gradient(180deg, #00D2FF 0%, #3A7BD5 100%);
    border-radius: 1rem;
    padding: 16px;
    box-shadow: var(--box-shadow);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 32vmin;
    text-align: center;

    .player-logo {
        position: relative;
        width: 6vmin;
        height: 6vmin;
        border-radius: 6vmin;
        margin-bottom: 2vmin;
        background: var(--gradient-color);

        i {
            display: none;
            position: absolute;
            font-size: 3vmin;
            top: 50%;
            transform: translateY(-50%);

            &:first-child {
                left: -4vmin;
            }

            &:last-child {
                right: -4vmin;
            }
        }
    }

    .player-number {
        font-size: 2vmin;
        font-weight: bold;
        opacity: 50%;
    }

    .player-name {
        font-size: 2.5vmin;
        font-weight: bold;
        margin: 1.5vmin 0;
    }

    .player-score {
        font-size: 5vmin;
        font-weight: bold;
    }
`;