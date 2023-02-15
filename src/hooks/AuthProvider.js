import React, { createContext, useContext, useEffect, useState } from 'react';

import { authWithTwitch, listenToAuthState } from '../services/auth';
import { listenToUserProfile } from '../services/database';
import { getUserData } from '../services/twitch';
import { useSegment } from './SegmentProvider';
import { useTwitch } from './TwitchProvider';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const twitch = useTwitch();
    const segment = useSegment();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function signUserWithTwitch(twitchExtensionData) {
            const userData = await getUserData(twitchExtensionData.id, twitchExtensionData.helixToken);

            // After signup the callback from listenToAuthState will be triggered
            authWithTwitch({ ...twitchExtensionData, ...userData });
        }

        async function loadUserProfile(uid, twitchExtensionData) {
            listenToUserProfile(uid, (user) => {
                if (user.exists()) {
                    /**
                     * twitchExtensionData is important as it contains tokens to call the Twitch API and to make requests
                     * to our own backend, so we merge all the relevant information in one object
                     */
                    setUser({ uid, ...user.val(), twitchExtensionData, notLinked: false });
                }
            });
        }

        if (twitch) {
            twitch.onAuthorized((auth) => {
                if (!twitch.viewer.isLinked) {
                    // Save not linked user data and let the frontend handled this however it like
                    setUser({
                        twitchExtensionData: {
                            ...auth,
                            ...twitch.viewer
                        },
                        notLinked: true
                    });

                    const firstTime = localStorage.getItem('firstTime');

                    if (firstTime === null) {
                        localStorage.setItem('firstTime', 'false');

                        // Request the user to link their Twitch account with the extension
                        return twitch.actions.requestIdShare();
                    }
                } else {
                    // Listen to auth state from firebase
                    listenToAuthState((user) => {
                        if (user) {
                            segment.identify(user.uid);
                            loadUserProfile(user.uid, {
                                ...auth,
                                ...twitch.viewer
                            });
                        } else {
                            signUserWithTwitch({
                                ...auth,
                                ...twitch.viewer
                            });
                        }
                    });
                }
            });
        }
    }, []);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}