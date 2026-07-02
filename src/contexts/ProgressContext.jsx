import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { PROGRESS_STORAGE_KEY } from '../storageKeys';
import { TOPIC_ORDER } from '../topics';

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
});

const loadProgress = () => {
    if (typeof window === 'undefined') return createDefaultProgress();
    try {
        const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
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
        window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
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

    const value = useMemo(
        () => ({
            progress,
            completedCount,
            totalCount,
            percentage,
            markTopicComplete,
            getNextTopic,
            isTopicCompleted,
            resetProgress,
        }),
        [progress, completedCount, totalCount, percentage, markTopicComplete, getNextTopic, isTopicCompleted, resetProgress]
    );

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
