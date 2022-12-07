import React, { createContext, useContext } from 'react';

const TwitchContext = createContext(null);

const TwitchProvider = ({ children }) => {
    const twitch = window.Twitch ? window.Twitch.ext : null;

    return (
        <TwitchContext.Provider value={twitch}>
            {children}
        </TwitchContext.Provider>
    );
}

export default TwitchProvider;

export const useTwitch = () => {
    return useContext(TwitchContext);
}