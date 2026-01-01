import React from 'react';
import { useTranslation } from 'react-i18next';

const TopicPage = ({ title }) => {
    const { t } = useTranslation();

    return (
        <div className="animate-fade-in">
            <h2>{t(title)}</h2>

            <div className="card">
                <p>Content for {t(title)} coming soon...</p>
            </div>
        </div>
    );
};

export default TopicPage;
