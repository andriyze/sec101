import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import Quiz from '../components/Quiz';
import TopicCompletionCard from '../components/TopicCompletionCard';
import PhishingEmailViz from '../components/visualizations/PhishingEmailViz';
import { tArray, tObject } from '../i18n/safeTranslate';

const Phishing = () => {
    const { t } = useTranslation();
    const quizQuestions = tArray(t, 'phishing.quiz.questions');

    return (
        <div className="animate-fade-in">
            <div className="section-header">
                <div className="section-title">
                    <Mail color="var(--primary)" size={40} />
                    <h2 style={{ margin: 0 }}>{t('nav.phishing')}</h2>
                </div>
                <p className="section-subtitle">{t('phishing.subtitle')}</p>
            </div>

            {/* Red Flags Section */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <AlertTriangle size={24} color="var(--accent)" /> <h3 style={{ margin: 0 }}>{t('phishing.red_flags.title')}</h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {[
                        tObject(t, 'phishing.red_flags.urgency'),
                        tObject(t, 'phishing.red_flags.url'),
                        tObject(t, 'phishing.red_flags.greeting'),
                        tObject(t, 'phishing.red_flags.attachment')
                    ].map((item, i) => (
                        <div key={i} className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
                            <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>{item.title}</h4>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>

                <PhishingEmailViz />

                <div className="card panel-solid" style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ marginBottom: '0.75rem' }}>{t('phishing.tips.title')}</h4>
                    <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                        {tArray(t, 'phishing.tips.items').map((item, i) => (
                            <li key={i} style={{ marginBottom: '0.35rem' }}>{item}</li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Email Security Checklist */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <Shield size={24} color="#00ff9d" /> <h3 style={{ margin: 0 }}>{t('phishing.checklist.title')}</h3>
                </div>
                <div className="card panel-solid" style={{ marginBottom: '1.5rem' }}>
                    <ul className="list-clean">
                        {tArray(t, 'phishing.checklist.items').map((item, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'start', gap: '1rem', marginBottom: '1rem' }}>
                                <CheckCircle size={20} color="#00ff9d" style={{ marginTop: '3px' }} />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card">
                    <h4 style={{ marginBottom: '0.5rem' }}>{t('phishing.after_click.title')}</h4>
                    <ol style={{ paddingLeft: '1.2rem' }}>
                        {tArray(t, 'phishing.after_click.steps').map((item, i) => (
                            <li key={i} style={{ marginBottom: '0.4rem' }}>{item}</li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="section">
                <div className="card panel-solid">
                    <h4 style={{ marginBottom: '0.5rem' }}>{t('phishing.annotated.title')}</h4>
                    <div className="badge-grid" style={{ marginBottom: '0.5rem' }}>
                        {tArray(t, 'phishing.sample.highlights').map((tag, i) => (
                            <span key={i} className="pill pill-accent">{tag}</span>
                        ))}
                    </div>
                    <div className="card" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                        <p style={{ marginBottom: '0.25rem', fontFamily: 'monospace', color: 'var(--text-main)' }}>{t('phishing.sample.from')}</p>
                        <p style={{ marginBottom: '0.25rem', fontFamily: 'monospace', color: 'var(--text-main)' }}>{t('phishing.sample.subject')}</p>
                        <p style={{ marginBottom: '0.5rem' }}>{t('phishing.sample.body')}</p>
                        <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
                            {tArray(t, 'phishing.annotated.callouts').map((item, i) => (
                                <li key={i} style={{ marginBottom: '0.35rem' }}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Other Phishing Channels - Smishing, Vishing, Quishing */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <AlertTriangle size={24} color="var(--secondary)" /> <h3 style={{ margin: 0 }}>{t('phishing.other_channels.title')}</h3>
                </div>
                <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>{t('phishing.other_channels.intro')}</p>
                <div className="grid grid-cols-3 gap-6">
                    <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                        <h4 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>{t('phishing.other_channels.smishing.title')}</h4>
                        <p>{t('phishing.other_channels.smishing.desc')}</p>
                    </div>
                    <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                        <h4 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>{t('phishing.other_channels.vishing.title')}</h4>
                        <p>{t('phishing.other_channels.vishing.desc')}</p>
                    </div>
                    <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                        <h4 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>{t('phishing.other_channels.quishing.title')}</h4>
                        <p>{t('phishing.other_channels.quishing.desc')}</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <Quiz
                    title={t('phishing.quiz.title')}
                    questions={quizQuestions}
                    storageKey="quiz-phishing"
                />
            </section>

            <TopicCompletionCard topicId="phishing" quizStorageKey="quiz-phishing" />
        </div>
    );
};

export default Phishing;
