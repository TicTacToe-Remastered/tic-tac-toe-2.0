import { Switch, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';

import Home from '../pages/Home';
import RoomRouter from '../pages/RoomRouter';
import Tutorial from "../pages/Tutorial";

const Router = () => {
    const location = useLocation();

    return (
        <AnimatePresence exitBeforeEnter>
            <Switch location={location} key={location.pathname}>
                <Route path="/" exact component={Home} />
                <Route path="/room/:id?" component={RoomRouter} />
                <Route path="/tutorial" component={Tutorial} />
            </Switch>
        </AnimatePresence>
    );
}

export default Router;