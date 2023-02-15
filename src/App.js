import React from 'react';

import './App.css';
import TwitchProvider from './hooks/TwitchProvider';
import AuthProvider from './hooks/AuthProvider';
import SegmentProvider from './hooks/SegmentProvider';
import Router from './Router';

function App() {
    return (
        <TwitchProvider>
            <SegmentProvider>
                <AuthProvider>
                    <Router />
                </AuthProvider>
            </SegmentProvider>
        </TwitchProvider>
    );
}

export default App;
