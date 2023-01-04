import React, { useEffect } from 'react';

import { changeLanguage } from './i18n';
import Config from './pages/Config';
import TweetReactionController from './pages/TweetReaction/TweetReactionController';

const Router = () => {
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
            return <TweetReactionController />;
        case 'config':
            return <Config />;
        default:
            return null;
    }
}

export default Router;