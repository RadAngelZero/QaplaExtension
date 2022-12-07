import React from 'react';
import { createHashRouter, createRoutesFromElements, Route, useRouteError } from 'react-router-dom';

import Root from './pages/Root';
import TweetReactionController from './pages/TweetReaction/TweetReactionController';

function ErrorBoundary() {
    let error = useRouteError();
    console.error(error);

    return <div>Dang!</div>;
}

export default createHashRouter(
    createRoutesFromElements(
        <Route path='/'
            element={<Root />}
            errorElement={<ErrorBoundary />} >
            <Route index element={
                <TweetReactionController />
            }
                errorElement={<ErrorBoundary />} />
            <Route path='/index.html' element={
                <TweetReactionController />
            }
                errorElement={<ErrorBoundary />} />
        </Route>
    )
);
