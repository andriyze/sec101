export const tArray = (t, key, options = {}) => {
    const fallback = Array.isArray(options.defaultValue) ? options.defaultValue : [];
    const value = t(key, { ...options, returnObjects: true, defaultValue: fallback });
    return Array.isArray(value) ? value : fallback;
};

export const tObject = (t, key, options = {}) => {
    const isPlainObject = (v) => v && typeof v === 'object' && !Array.isArray(v);
    const fallback = isPlainObject(options.defaultValue) ? options.defaultValue : {};
    const value = t(key, { ...options, returnObjects: true, defaultValue: fallback });
    return isPlainObject(value) ? value : fallback;
};
