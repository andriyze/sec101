import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'sec101-progress';
const TOPIC_ORDER = ['passwords', 'phishing', 'browsing', 'social', 'devices', 'tools', 'advanced'];

const createDefaultProgress = () => ({
    version: 1,
    topics: {
        passwords: { completed: false },
        phishing: { completed: false },
        browsing: { completed: false },
        social: { completed: false },
        devices: { completed: false },
        tools: { completed: false },
        advanced: { completed: false },
    },
    lastVisitedTopic: null,
});

const loadProgress = () => {
    if (typeof window === 'undefined') return createDefaultProgress();
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return createDefaultProgress();
        const parsed = JSON.parse(raw);
        if (parsed.version !== 1) return createDefaultProgress();
        return parsed;
    } catch {
        return createDefaultProgress();
    }
};

const saveProgress = (progress) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
        // localStorage might be disabled
    }
};

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
    const [progress, setProgress] = useState(loadProgress);

    useEffect(() => {
        saveProgress(progress);
    }, [progress]);

    const markTopicComplete = useCallback((topicId, method = 'quiz') => {
        setProgress((prev) => {
            if (prev.topics[topicId]?.completed) return prev;
            return {
                ...prev,
                topics: {
                    ...prev.topics,
                    [topicId]: {
                        completed: true,
                        completedAt: new Date().toISOString(),
                        method,
                    },
                },
            };
        });
    }, []);

    const markTopicVisited = useCallback((topicId) => {
        setProgress((prev) => ({
            ...prev,
            lastVisitedTopic: `/${topicId}`,
        }));
    }, []);

    const getNextTopic = useCallback(() => {
        for (const topic of TOPIC_ORDER) {
            if (!progress.topics[topic]?.completed) {
                return topic;
            }
        }
        return null;
    }, [progress]);

    const completedCount = Object.values(progress.topics).filter((t) => t.completed).length;
    const totalCount = TOPIC_ORDER.length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    const isTopicCompleted = useCallback(
        (topicId) => progress.topics[topicId]?.completed || false,
        [progress]
    );

    const resetProgress = useCallback(() => {
        setProgress(createDefaultProgress());
    }, []);

    const value = {
        progress,
        completedCount,
        totalCount,
        percentage,
        markTopicComplete,
        markTopicVisited,
        getNextTopic,
        isTopicCompleted,
        resetProgress,
    };

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgress() {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
}

export { TOPIC_ORDER };
