import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Smartphone, Globe, KeyRound } from 'lucide-react';
import Quiz from '../components/Quiz';
import TopicCompletionCard from '../components/TopicCompletionCard';

const Tools = () => {
    const { t } = useTranslation();
    const quizQuestions = t('tools.quiz.questions', { returnObjects: true, defaultValue: [] }) || [];

    const sections = [
        {
            title: t('tools.messengers.title'),
            icon: <Smartphone size={22} color="var(--primary)" />,
            items: t('tools.messengers.items', { returnObjects: true })
        },
        {
            title: t('tools.passwords.title'),
            icon: <KeyRound size={22} color="var(--primary)" />,
            items: t('tools.passwords.items', { returnObjects: true })
        },
        {
            title: t('tools.mfa.title'),
            icon: <Lock size={22} color="var(--primary)" />,
            items: t('tools.mfa.items', { returnObjects: true })
        },
        {
            title: t('tools.os.title'),
            icon: <Shield size={22} color="var(--primary)" />,
            items: t('tools.os.items', { returnObjects: true })
        },
        {
            title: t('tools.browsers.title'),
            icon: <Globe size={22} color="var(--primary)" />,
            items: t('tools.browsers.items', { returnObjects: true })
        },
        {
            title: t('tools.encryption.title'),
            icon: <Lock size={22} color="var(--primary)" />,
            intro: t('tools.encryption.intro'),
            items: t('tools.encryption.items', { returnObjects: true }),
            takeaways: t('tools.encryption.takeaways', { returnObjects: true })
        }
    ];

    return (
        <div className="animate-fade-in">
            <div className="section-header">
                <div className="section-title">
                    <Shield color="var(--primary)" size={40} />
                    <h2 style={{ margin: 0 }}>{t('tools.title')}</h2>
                </div>
                <p className="section-subtitle">{t('tools.subtitle')}</p>
                <span className="pill">{t('tools.reviewed')}</span>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {sections.map((section, idx) => (
                    <div key={idx} className="tool-section panel-solid">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {section.icon}
                            <h3 style={{ margin: 0 }}>{section.title}</h3>
                        </div>
                        {section.intro && (
                            <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                {section.intro}
                            </p>
                        )}
                        <div className="tool-list">
                            {section.items.map((tool, i) => {
                                const content = (
                                    <>
                                        <div className="tool-list-icon" aria-hidden="true">{tool.emoji}</div>
                                        <div className="tool-list-copy">
                                            <h4>{tool.name}</h4>
                                            <p>{tool.desc}</p>
                                        </div>
                                        {tool.link && <span className="tool-list-action">{t('common.visit')}</span>}
                                    </>
                                );

                                return tool.link ? (
                                    <a
                                        key={i}
                                        className="tool-list-item"
                                        href={tool.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {content}
                                    </a>
                                ) : (
                                    <div key={i} className="tool-list-item">
                                        {content}
                                    </div>
                                );
                            })}
                        </div>
                        {section.takeaways && (
                            <div style={{ marginTop: '0.75rem' }}>
                                <h4 style={{ marginBottom: '0.35rem' }}>{t('tools.encryption.takeaways_title')}</h4>
                                <ul style={{ paddingLeft: '1.2rem' }}>
                                    {section.takeaways.map((item, i) => (
                                        <li key={i} style={{ marginBottom: '0.3rem' }}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Quiz */}
            <section className="section" style={{ marginTop: '2rem' }}>
                <Quiz
                    title={t('tools.quiz.title')}
                    questions={quizQuestions}
                    storageKey="quiz-tools"
                />
            </section>

            <TopicCompletionCard topicId="tools" quizStorageKey="quiz-tools" />
        </div>
    );
};

export default Tools;
