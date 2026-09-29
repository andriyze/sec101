// localStorage access that never throws. Browsers that block site data throw on merely
// reading `window.localStorage`, and there is no window at all while prerendering.

export const readStorage = (key) => {
    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
};

export const writeStorage = (key, value) => {
    try {
        window.localStorage.setItem(key, value);
    } catch {
        // storage unavailable: the value lives for this visit only
    }
};

export const removeStorage = (key) => {
    try {
        window.localStorage.removeItem(key);
    } catch {
        // storage unavailable: nothing was saved
    }
};
