import { Switch, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';

import Home from '../pages/Home';
import RoomRouter from '../pages/RoomRouter';

const Router = () => {
    const location = useLocation();

    return (
        <AnimatePresence exitBeforeEnter>
            <Switch location={location} key={location.pathname}>
                <Route path="/" exact component={Home} />
                <Route path="/room/:id?" component={RoomRouter} />
            </Switch>
        </AnimatePresence>
    );
}

export default Router;