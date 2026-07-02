import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, ArrowRight } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { useProgress } from '../hooks/useProgress';
import { TOPIC_LABEL_KEYS } from '../topics';

const ProgressCard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { completedCount, totalCount, percentage, getNextTopic } = useProgress();

    const nextTopic = getNextTopic();
    const isAllComplete = completedCount === totalCount;
    const hasStarted = completedCount > 0;

    const handleContinue = () => {
        if (nextTopic) {
            navigate(`/${nextTopic}`);
        }
    };

    if (!hasStarted) {
        return null;
    }

    return (
        <div className="progress-card card panel-solid">
            <div className="progress-card-header">
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isAllComplete && <CheckCircle size={20} color="#00ff9d" />}
                    {t('progress.title')}
                </h3>
                <span className="pill pill-success">{percentage}%</span>
            </div>

            <ProgressBar completed={completedCount} total={totalCount} showLabel={false} />

            <p style={{ margin: '0.75rem 0 0', color: 'var(--text-muted)' }}>
                {isAllComplete
                    ? t('progress.all_complete')
                    : t('progress.completed', { count: completedCount, total: totalCount })}
            </p>

            {!isAllComplete && nextTopic && (
                <button
                    onClick={handleContinue}
                    className="btn btn-primary"
                    style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {t('progress.continue', { topic: t(TOPIC_LABEL_KEYS[nextTopic]) })}
                    <ArrowRight size={18} />
                </button>
            )}
        </div>
    );
};

export default ProgressCard;
