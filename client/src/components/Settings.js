import { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

import Tutorial from "./Tutorial";

import SettingsIcon from '../icons/SettingsIcon';
import InfoIcon from '../icons/InfoIcon';
import MoonIcon from "../icons/MoonIcon";

const variants = {
    open: {
        transition: { staggerChildren: 0.1 }
    },
    closed: {
        transition: { staggerChildren: 0.1, staggerDirection: -1 }
    }
};

const item = {
    open: {
        opacity: 1,
        transition: { duration: 0.3 }
    },
    closed: {
        opacity: 0,
        transition: { duration: 0.3 }
    }
};

export default function Settings({ themeToggler }) {
    const [dropdown, setDropdown] = useState(false);
    const [tutorial, setTutorial] = useState(false);

    const handleDropdown = () => setDropdown(!dropdown);
    const handleTutorial = () => setTutorial(!tutorial);

    return (
        <>
            <Nav>
                <IconButton onClick={handleDropdown}><SettingsIcon /></IconButton>
                <AnimatePresence exitBeforeEnter>
                    {dropdown &&
                        <Dropdown
                            variants={variants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                        >
                            <IconButton
                                variants={item}
                                onClick={handleTutorial}
                            >
                                <InfoIcon />
                            </IconButton>
                            <IconButton
                                variants={item}
                                onClick={themeToggler}
                            >
                                <MoonIcon />
                            </IconButton>
                        </Dropdown>
                    }
                </AnimatePresence>
            </Nav>
            <AnimatePresence exitBeforeEnter>
                {tutorial && <Tutorial handleTutorial={handleTutorial} />}
            </AnimatePresence>
        </>
    )
}

const Nav = styled.nav`
    position: fixed;
    top: 3vmin;
    right: 3vmin;
    margin-top: 2vmin;
    margin-right: 3vmin;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3vmin;
`;

const IconButton = styled(motion.button)`
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    transition: transform ${({ theme }) => theme.transition};

    svg {
        width: 4vmin;
        height: 4vmin;
        color: ${({ theme }) => theme.text};
        transition: color ${({ theme }) => theme.transition};
    }

    &:hover {
        transform: scale(1.1);
    }
`;

const Dropdown = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3vmin;
`;