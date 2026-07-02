import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle, Circle, PartyPopper } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { QUIZ_UPDATED_EVENT } from '../storageKeys';
import { TOPIC_LABEL_KEYS } from '../topics';

const TopicCompletionCard = ({ topicId, quizStorageKey }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { markTopicComplete, isTopicCompleted, getNextTopic, completedCount, totalCount } = useProgress();

    const [quizScore, setQuizScore] = useState(0);

    useEffect(() => {
        const checkScore = () => {
            if (typeof window === 'undefined' || !quizStorageKey) {
                setQuizScore(0);
                return;
            }

            const stored = localStorage.getItem(quizStorageKey);
            if (!stored) {
                setQuizScore(0);
                return;
            }

            try {
                const data = JSON.parse(stored);
                const percent = data.total > 0 ? Math.round((data.score / data.total) * 100) : 0;
                setQuizScore(percent);
            } catch {
                setQuizScore(0);
            }
        };

        const handleQuizUpdated = (event) => {
            if (!event.detail?.storageKey || event.detail.storageKey === quizStorageKey) {
                checkScore();
            }
        };

        checkScore();
        window.addEventListener('storage', checkScore);
        window.addEventListener(QUIZ_UPDATED_EVENT, handleQuizUpdated);

        return () => {
            window.removeEventListener('storage', checkScore);
            window.removeEventListener(QUIZ_UPDATED_EVENT, handleQuizUpdated);
        };
    }, [quizStorageKey]);

    const quizPassed = quizScore >= 50;
    const isComplete = isTopicCompleted(topicId);
    const nextTopic = getNextTopic();
    const isAllComplete = completedCount === totalCount;

    const handleMarkComplete = () => {
        markTopicComplete(topicId, 'quiz');
    };

    // State 1: Quiz not passed
    if (!quizPassed && !isComplete) {
        return (
            <div className="completion-card card panel-solid" style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <Circle size={24} color="var(--text-muted)" />
                    <h3 style={{ margin: 0 }}>{t('completion.quiz_required')}</h3>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                    {t('completion.quiz_required_desc')}
                </p>
                {quizScore > 0 && (
                    <p style={{ margin: '0.5rem 0 0', color: 'var(--accent)', fontSize: '0.9rem' }}>
                        {t('completion.current_score', { score: quizScore })}
                    </p>
                )}
            </div>
        );
    }

    // State 2: Quiz passed, not marked complete
    if (quizPassed && !isComplete) {
        return (
            <div className="completion-card card panel-solid" style={{ marginTop: '2rem', borderColor: 'rgba(0, 255, 157, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <CheckCircle size={24} color="#00ff9d" />
                    <h3 style={{ margin: 0, color: '#00ff9d' }}>
                        {t('completion.quiz_passed', { score: quizScore })}
                    </h3>
                </div>
                <p style={{ margin: '0 0 1rem', color: 'var(--text-muted)' }}>
                    {t('completion.ready_to_complete')}
                </p>
                <button
                    onClick={handleMarkComplete}
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <CheckCircle size={18} />
                    {t('completion.mark_complete')}
                </button>
                {nextTopic && (
                    <p style={{ margin: '1rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {t('completion.next_preview', { topic: t(TOPIC_LABEL_KEYS[nextTopic]) })}
                    </p>
                )}
            </div>
        );
    }

    // State 3: Topic complete
    return (
        <div className="completion-card card panel-solid" style={{ marginTop: '2rem', borderColor: 'rgba(0, 255, 157, 0.3)', background: 'rgba(0, 255, 157, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                {isAllComplete ? (
                    <PartyPopper size={24} color="#00ff9d" />
                ) : (
                    <CheckCircle size={24} color="#00ff9d" />
                )}
                <h3 style={{ margin: 0, color: '#00ff9d' }}>
                    {isAllComplete ? t('progress.all_complete') : t('progress.topic_complete')}
                </h3>
            </div>

            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                {t('progress.completed', { count: completedCount, total: totalCount })}
            </p>

            {!isAllComplete && nextTopic && (
                <button
                    onClick={() => navigate(`/${nextTopic}`)}
                    className="btn btn-primary"
                    style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {t('progress.next_topic', { topic: t(TOPIC_LABEL_KEYS[nextTopic]) })}
                    <ArrowRight size={18} />
                </button>
            )}

            {isAllComplete && (
                <button
                    onClick={() => navigate('/')}
                    className="btn btn-glass"
                    style={{ marginTop: '1rem' }}
                >
                    {t('progress.review')}
                </button>
            )}
        </div>
    );
};

export default TopicCompletionCard;
