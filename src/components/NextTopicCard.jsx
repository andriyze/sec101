import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle, PartyPopper } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';

const TOPIC_LABELS = {
    passwords: 'nav.passwords',
    phishing: 'nav.phishing',
    browsing: 'nav.browsing',
    social: 'nav.social',
    devices: 'nav.devices',
    tools: 'nav.tools',
    advanced: 'nav.advanced',
};

const NextTopicCard = ({ currentTopic }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { completedCount, totalCount, getNextTopic, isTopicCompleted } = useProgress();

    const isCurrentCompleted = isTopicCompleted(currentTopic);
    const nextTopic = getNextTopic();
    const isAllComplete = completedCount === totalCount;

    if (!isCurrentCompleted) {
        return null;
    }

    return (
        <div className="next-topic-card card panel-solid" style={{ marginTop: '2rem' }}>
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
                    {t('progress.next_topic', { topic: t(TOPIC_LABELS[nextTopic]) })}
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

export default NextTopicCard;
