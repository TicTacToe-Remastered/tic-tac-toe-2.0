import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';

import Home from '../pages/Home';
/* import RoomRouter from '../pages/RoomRouter'; */
import Tutorial from "../pages/Tutorial";
import RoomList from "../pages/RoomList";
import Room from "../pages/Room";

const Router = () => {
    const location = useLocation();

    return (
        <AnimatePresence exitBeforeEnter>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="room/:id" element={<Room />} />
                <Route path="room" element={<RoomList />} />
                <Route path="tutorial" element={<Tutorial />} />
            </Routes>
        </AnimatePresence>
    );
}

export default Router;