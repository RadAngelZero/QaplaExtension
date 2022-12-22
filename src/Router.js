import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { changeLanguage } from './i18n';
import Routes from './Routes';

const Router = () => {
    useEffect(() => {
        // Get and set user language from query params
        const query = new URLSearchParams(window.location.href);
        const language = query.get('language') ? query.get('language') : 'en';
        changeLanguage(language);
    }, []);

    return (
        <RouterProvider router={Routes} />
    );
}

export default Router;