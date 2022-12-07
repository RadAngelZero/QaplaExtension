import React from 'react';

import './App.css';
import TwitchProvider from './hooks/TwitchProvider';
import AuthProvider from './hooks/AuthProvider';
import Router from './Router';

function App() {
    return (
        <TwitchProvider>
            <AuthProvider>
                <Router />
            </AuthProvider>
        </TwitchProvider>
    );
}

export default App;
