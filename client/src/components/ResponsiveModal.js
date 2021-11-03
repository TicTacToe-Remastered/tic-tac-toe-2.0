import styled from 'styled-components';

const ResponsiveModal = () => {
    return (
        <Modal>
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="64" cy="64" r="62" stroke="url(#paint0_linear)" strokeWidth="4"/>
                <circle cx="108" cy="108" r="30" stroke="url(#paint1_linear)" strokeWidth="4"/>
                <defs>
                    <linearGradient id="paint0_linear" x1="64" y1="0" x2="64" y2="128" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00D2FF"/>
                        <stop offset="1" stopColor="#3A7BD5"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="108" y1="76" x2="108" y2="140" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF512F"/>
                        <stop offset="1" stopColor="#DD2476"/>
                    </linearGradient>
                </defs>
            </svg>
            <span>Turn your screen or enlarge your window!</span>
        </Modal>
    );
}

export default ResponsiveModal;

const Modal = styled.div`
    z-index: 101;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    background: var(--background-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    svg {
        height: 25vmin;
        width: 25vmin;
        margin: 6vmin;
    }

    span {
        font-size: 4vmin;
        font-weight: bold;
        margin: 3vmin;
    }
`;