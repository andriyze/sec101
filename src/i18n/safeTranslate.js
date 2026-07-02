export const tArray = (t, key, options = {}) => {
    const value = t(key, { ...options, returnObjects: true, defaultValue: options.defaultValue ?? [] });
    return Array.isArray(value) ? value : [];
};

export const tObject = (t, key, options = {}) => {
    const value = t(key, { ...options, returnObjects: true, defaultValue: options.defaultValue ?? {} });
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
};
