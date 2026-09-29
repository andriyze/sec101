import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { LANGUAGE_STORAGE_KEY } from '../storageKeys';

// Each language is its own chunk (the two files are ~320 KB together); only the active one loads.
const LANGUAGE_LOADERS = {
    en: () => import('./en.json'),
    ua: () => import('./ua.json'),
};
const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_LOADERS);

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
        // Filled by loadLanguage before anything renders.
        resources: {},
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

/** Fetches a language's strings if they are not loaded yet. */
export const loadLanguage = async (lng) => {
    if (i18n.hasResourceBundle(lng, 'translation')) return;
    const { default: strings } = await LANGUAGE_LOADERS[lng]();
    i18n.addResourceBundle(lng, 'translation', strings);
};

/** Switches language once its strings are loaded, so the UI never shows raw keys. */
export const switchLanguage = async (lng) => {
    await loadLanguage(lng);
    await i18n.changeLanguage(lng);
};

export default i18n;
