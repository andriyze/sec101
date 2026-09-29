import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { LANGUAGE_STORAGE_KEY } from '../storageKeys';

// Each language is its own chunk (the two files are ~320 KB together); only the active one loads.
const LANGUAGE_LOADERS = {
    en: () => import('./en.json'),
    ua: () => import('./ua.json'),
};
const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_LOADERS);
const DEFAULT_LANGUAGE = 'en';

const loadStoredLanguage = () => {
    if (typeof window === 'undefined') return null;
    try {
        const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        return SUPPORTED_LANGUAGES.includes(stored) ? stored : null;
    } catch {
        return null;
    }
};

// IANA renamed Europe/Kiev to Europe/Kyiv in 2022 and folded Uzhgorod and Zaporozhye into it;
// browsers report any of these, depending on their time zone data.
const KYIV_TIME_ZONES = new Set(['Europe/Kyiv', 'Europe/Kiev', 'Europe/Uzhgorod', 'Europe/Zaporozhye']);

/**
 * Ukrainian when the device lists Ukrainian anywhere in its languages (browsers report it as
 * "uk"; this app's code for it is "ua") or runs on Kyiv time; English otherwise.
 */
export const pickLanguage = (preferred, timeZone) => {
    const listsUkrainian = preferred.some((tag) => String(tag).toLowerCase().split('-')[0] === 'uk');
    return listsUkrainian || KYIV_TIME_ZONES.has(timeZone) ? 'ua' : DEFAULT_LANGUAGE;
};

const detectDeviceLanguage = () => {
    if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE;
    let timeZone;
    try {
        timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
        timeZone = undefined;
    }
    return pickLanguage(navigator.languages?.length ? navigator.languages : [navigator.language], timeZone);
};

i18n
    .use(initReactI18next)
    .init({
        // Filled by loadLanguage before anything renders.
        resources: {},
        // A choice made with the language toggle wins; otherwise follow the device.
        lng: loadStoredLanguage() ?? detectDeviceLanguage(),
        fallbackLng: DEFAULT_LANGUAGE,
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
