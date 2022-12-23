import React from 'react';
import { createHashRouter, createRoutesFromElements, Route, useRouteError } from 'react-router-dom';

import Root from './pages/Root';
import TweetReactionController from './pages/TweetReaction/TweetReactionController';
import Config from './pages/Config';

function ErrorBoundary() {
    let error = useRouteError();
    console.error(error);

    return (<h2 style={{ color: '#FFF' }}>
            {JSON.stringify(error)}
        </h2>
    );
}

export default createHashRouter(
    createRoutesFromElements(
        <Route path='/'
            element={<Root />}
            errorElement={<ErrorBoundary />} >
            <Route path='/react' element={
                    <TweetReactionController />
                }
                errorElement={<ErrorBoundary />} />
            <Route path='/config' element={
                    <Config />
                }
                errorElement={<ErrorBoundary />} />
        </Route>
    )
);
