import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from './hooks/AuthProvider';
import { useTwitch } from './hooks/TwitchProvider';
import { changeLanguage } from './i18n';
import Routes from './Routes';

const Router = () => {
    const user = useAuth();
    const twitch = useTwitch();
    const { t } = useTranslation();

    useEffect(() => {
        // Get and set user language from query params
        const query = new URLSearchParams(window.location.href);
        const language = query.get('language');
        changeLanguage(language);
    }, []);

    /* if (user) {
        if (user.twitchExtensionData && user.twitchExtensionData.isLinked) { */
            return (
                <RouterProvider router={Routes} />
            );
        /* } else {
            return (
                <h1>
                    <button onClick={twitch.actions.requestIdShare}>
                        {t('linkToContinue')}
                    </button>
                </h1>
            );
        }
    } */

    return null;
}

export default Router;