import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import { Globe, Shield, EyeOff, Settings, Cookie, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import Quiz from '../components/Quiz';
import TopicCompletionCard from '../components/TopicCompletionCard';
import TrackerBlockingViz from '../components/visualizations/TrackerBlockingViz';
import { tArray } from '../i18n/safeTranslate';

const Browsing = () => {
    const { t } = useTranslation();
    const quizQuestions = tArray(t, 'browsing.quiz.questions');
    const quickSettings = tArray(t, 'browsing.quick_settings.items');
    const cookieItems = tArray(t, 'browsing.cookies.items');
    const warningItems = tArray(t, 'browsing.warnings.items');
    const hardeningKeys = ['brave', 'firefox', 'tor'];

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

            {/* Cookies */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '0.5rem' }}>
                    <Cookie size={24} color="var(--primary)" /> <h3 style={{ margin: 0 }}>{t('browsing.cookies.title')}</h3>
                </div>
                <p className="section-subtitle" style={{ marginBottom: '1.2rem' }}>{t('browsing.cookies.intro')}</p>

                <div className="grid grid-cols-2 gap-6">
                    {cookieItems.map((item, i) => (
                        <div key={i} className="card panel-solid">
                            <div className="icon-box" aria-hidden="true">{item.emoji}</div>
                            <h4 style={{ margin: '0.75rem 0 0.5rem' }}>{item.title}</h4>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
                    <Lightbulb size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <p style={{ margin: 0 }}>{t('browsing.cookies.tip')}</p>
                </div>
            </section>

            {/* Scary browser warnings, decoded */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '0.5rem' }}>
                    <AlertTriangle size={24} color="var(--accent)" /> <h3 style={{ margin: 0 }}>{t('browsing.warnings.title')}</h3>
                </div>
                <p className="section-subtitle" style={{ marginBottom: '1.2rem' }}>{t('browsing.warnings.intro')}</p>

                <div className="grid grid-cols-2 gap-6">
                    {warningItems.map((item, i) => (
                        <div key={i} className="card panel-solid">
                            <div className="icon-box" aria-hidden="true">{item.emoji}</div>
                            <h4 style={{ margin: '0.75rem 0 0.5rem' }}>{item.title}</h4>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.6rem' }}>
                                <CheckCircle size={14} color="#00ff9d" style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>{item.action}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
                    <Lightbulb size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <p style={{ margin: 0 }}>{t('browsing.warnings.tip')}</p>
                </div>
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
                            <div className="icon-box" aria-hidden="true">🦁</div>
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
                                {tArray(t, `browsing.hardening.${browserKey}.steps`).map((step, i) => (
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
                />
            </section>

            <TopicCompletionCard topicId="browsing" quizStorageKey="quiz-browsing" />
        </div>
    );
};

export default Browsing;
