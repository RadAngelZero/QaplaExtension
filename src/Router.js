import React, { useEffect } from 'react';
import WeNeedPermissionDialog from './components/WeNeedPermissionDialog';

import { useAuth } from './hooks/AuthProvider';

import { changeLanguage } from './i18n';
import Config from './pages/Config';
import TweetReactionController from './pages/TweetReaction/TweetReactionController';

const Router = () => {
    const user = useAuth();

    useEffect(() => {
        // Get and set user language from query params
        const query = new URLSearchParams(window.location.href);
        const language = query.get('language') ? query.get('language') : 'en';
        changeLanguage(language);
    }, []);

    const query = new URLSearchParams(window.location.href);
    const mode = query.get('mode') ? query.get('mode') : 'viewer';

    switch (mode) {
        case 'viewer':
            if (user) {
                if (user.notLinked) {
                    return <WeNeedPermissionDialog />;
                }

                return <TweetReactionController />;
            }

            return null;
        case 'config':
            return <Config />;
        default:
            return null;
    }
}

export default Router;