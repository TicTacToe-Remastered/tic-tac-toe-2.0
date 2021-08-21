
import { BrowserRouter, Route } from "react-router-dom";

import Home from '../pages/Home';
import RoomRouter from '../pages/RoomRouter';

const Router = () => {
    return (
        <BrowserRouter>
            <Route path="/" exact component={Home} />
            <Route path="/room/:id?" component={RoomRouter} />
        </BrowserRouter>
    );
}

export default Router;