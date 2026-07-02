import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import ua from './ua.json';
import { LANGUAGE_STORAGE_KEY } from '../storageKeys';

const SUPPORTED_LANGUAGES = ['en', 'ua'];

const loadStoredLanguage = () => {
    if (typeof window === 'undefined') return null;
    try {
        const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        return SUPPORTED_LANGUAGES.includes(stored) ? stored : null;
    } catch {
        return null;
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ua: { translation: ua },
        },
        lng: loadStoredLanguage() ?? 'ua',
        fallbackLng: 'ua',
        interpolation: {
            escapeValue: false,
        },
    });

i18n.on('languageChanged', (lng) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    } catch {
        // localStorage might be disabled
    }
});

export default i18n;
