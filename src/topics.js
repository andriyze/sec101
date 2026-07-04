export const TOPICS = [
    { id: 'phishing', path: '/phishing', labelKey: 'nav.phishing' },
    { id: 'passwords', path: '/passwords', labelKey: 'nav.passwords' },
    { id: 'browsing', path: '/browsing', labelKey: 'nav.browsing' },
    { id: 'social', path: '/social', labelKey: 'nav.social' },
    { id: 'devices', path: '/devices', labelKey: 'nav.devices' },
    { id: 'tools', path: '/tools', labelKey: 'nav.tools' },
    { id: 'advanced', path: '/advanced', labelKey: 'nav.advanced' },
];

export const TOPIC_ORDER = TOPICS.map((topic) => topic.id);

export const TOPIC_LABEL_KEYS = TOPICS.reduce((labels, topic) => {
    labels[topic.id] = topic.labelKey;
    return labels;
}, {});

export const TOPIC_PATHS = TOPICS.reduce((paths, topic) => {
    paths[topic.id] = topic.path;
    return paths;
}, {});
