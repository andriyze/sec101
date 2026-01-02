import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import { Globe, Shield, EyeOff, Settings } from 'lucide-react';
import Quiz from '../components/Quiz';
import NextTopicCard from '../components/NextTopicCard';
import { useProgress } from '../hooks/useProgress';
import TrackerBlockingViz from '../components/visualizations/TrackerBlockingViz';

const Browsing = () => {
    const { t } = useTranslation();
    const { markTopicComplete } = useProgress();
    const quizQuestions = t('browsing.quiz.questions', { returnObjects: true, defaultValue: [] }) || [];
    const quickSettings = t('browsing.quick_settings.items', { returnObjects: true, defaultValue: [] }) || [];
    const hardeningKeys = ['brave', 'firefox', 'tor'];

    const handleQuizComplete = () => {
        markTopicComplete('browsing', 'quiz');
    };

    return (
        <div className="animate-fade-in">
            <div className="section-header">
                <div className="section-title">
                    <Globe color="var(--primary)" size={40} />
                    <h2 style={{ margin: 0 }}>{t('nav.browsing')}</h2>
                </div>
                <p className="section-subtitle">{t('browsing.subtitle')}</p>
            </div>

            {/* Extensions */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '0.5rem' }}>
                    <Settings size={24} color="var(--primary)" /> <h3 style={{ margin: 0 }}>{t('browsing.extensions.title')}</h3>
                </div>
                <p className="section-subtitle" style={{ marginBottom: '1.2rem' }}>{t('browsing.extensions.intro')}</p>

                <div className="grid grid-cols-2 gap-6">
                    <Card
                        title={t('browsing.extensions.ublock.title')}
                        icon="🛡️"
                        description={t('browsing.extensions.ublock.desc')}
                        link="https://ublockorigin.com"
                        linkText={t('common.get') + " uBlock Origin"}
                    />
                    <Card
                        title={t('browsing.extensions.privacy_badger.title')}
                        icon="🦡"
                        description={t('browsing.extensions.privacy_badger.desc')}
                        link="https://privacybadger.org"
                        linkText={t('common.get') + " Privacy Badger"}
                    />
                </div>

                <div className="card panel-solid" style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>{t('browsing.quick_settings.title')}</h4>
                    <ul style={{ paddingLeft: '1.2rem' }}>
                        {quickSettings.map((item, i) => (
                            <li key={i} style={{ marginBottom: '0.4rem' }}>{item}</li>
                        ))}
                    </ul>
                </div>

                <TrackerBlockingViz />
            </section>

            {/* Browsers */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <EyeOff size={24} color="var(--secondary)" /> <h3 style={{ margin: 0 }}>{t('browsing.browsers.title')}</h3>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="card card-recommended">
                        <span className="recommended-badge">{t('common.recommended')}</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <div className="icon-box">🦁</div>
                            <h3 style={{ margin: '0 0 0 1rem' }}>Brave</h3>
                        </div>
                        <p>{t('browsing.browsers.brave')}</p>
                        <a href="https://brave.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', marginTop: '1rem', fontWeight: 600 }}>
                            {t('common.get')} Brave <span style={{ marginLeft: '5px' }}>→</span>
                        </a>
                    </div>
                    <Card
                        title="Firefox"
                        icon="🦊"
                        description={t('browsing.browsers.firefox')}
                        link="https://mozilla.org/firefox"
                        linkText={t('common.get') + " Firefox"}
                    />
                    <Card
                        title="Tor Browser"
                        icon="🧅"
                        description={t('browsing.browsers.tor')}
                        link="https://torproject.org"
                        linkText={t('common.get') + " Tor"}
                    />
                </div>

                <div className="grid grid-cols-3 gap-6" style={{ marginTop: '1.5rem' }}>
                    {hardeningKeys.map((browserKey) => (
                        <div key={browserKey} className="card panel-solid">
                            <h4 style={{ marginBottom: '0.5rem' }}>{t(`browsing.hardening.${browserKey}.title`)}</h4>
                            <ul style={{ paddingLeft: '1.2rem' }}>
                                {(t(`browsing.hardening.${browserKey}.steps`, { returnObjects: true, defaultValue: [] }) || []).map((step, i) => (
                                    <li key={i} style={{ marginBottom: '0.35rem' }}>{step}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section">
                <Quiz
                    title={t('browsing.quiz.title')}
                    questions={quizQuestions}
                    storageKey="quiz-browsing"
                    onComplete={handleQuizComplete}
                />
            </section>

            <NextTopicCard currentTopic="browsing" />
        </div>
    );
};

export default Browsing;
