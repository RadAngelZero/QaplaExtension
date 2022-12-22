import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en.json';
import es from './translations/es.json';

i18n.use(initReactI18next).init({
    debug: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
    lng: 'es',
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    interpolation: {
        escapeValue: false
    },
    resources: {
        en,
        es
    }
});

/**
 * Change the language of all the dashboard content
 * @param {string} language Language key e.g: en for english es for spanish
 */
export function changeLanguage(language) {
    i18n.changeLanguage(language);
}

export function getAvailableLanguages() {
    return ['en', 'es'];
}

export function getCurrentLanguage() {
    return typeof i18n.language === 'string' ? i18n.language.substring(0, 2) : i18n.language;
}