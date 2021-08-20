
import { BrowserRouter, Route } from "react-router-dom";

import Home from '../pages/Home';
import Room from '../pages/Room';

const Router = () => {
    return (
        <BrowserRouter>
            <Route path="/" exact component={Home} />
            <Route path="/room/:id?" component={Room} />
        </BrowserRouter>
    );
}

export default Router;