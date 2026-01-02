import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, CheckCircle, Lock, Eye, KeyRound, Globe, Mail, Smartphone } from 'lucide-react';
import ProgressCard from '../components/ProgressCard';
import { useProgress } from '../hooks/useProgress';

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { completedCount, getNextTopic, isTopicCompleted } = useProgress();

    const hasStarted = completedCount > 0;
    const nextTopic = getNextTopic();

    const topics = [
        { path: '/passwords', icon: '🔑', label: t('nav.passwords'), desc: t('home.cards.passwords.desc'), time: '10–15 min' },
        { path: '/phishing', icon: '✉️', label: t('nav.phishing'), desc: t('home.cards.phishing.desc'), time: '5 min' },
        { path: '/browsing', icon: '🛡️', label: t('nav.browsing'), desc: t('home.cards.browsing.desc'), time: '7 min' },
        { path: '/social', icon: '💬', label: t('nav.social'), desc: t('home.cards.social.desc'), time: '6 min' },
        { path: '/devices', icon: '📱', label: t('nav.devices'), desc: t('home.cards.devices.desc'), time: '8 min' },
        { path: '/tools', icon: '🔧', label: t('nav.tools'), desc: t('home.cards.tools.desc'), time: '5 min' },
        { path: '/advanced', icon: '🎓', label: t('nav.advanced'), desc: t('home.cards.advanced.desc'), time: '10 min' },
    ];

    return (
        <div className="animate-fade-in">
            <div className="section" style={{ textAlign: 'center', padding: '3rem 0 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <Shield size={80} color="var(--primary)" />
                </div>
                <h1>{t('app.title')}</h1>
                <p className="section-subtitle" style={{ margin: '1rem auto 2rem', maxWidth: '720px', fontSize: '1.2rem' }}>
                    {t('app.subtitle')}
                </p>
                <div className="badge-grid" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <span className="pill pill-success">{t('home.badges.time')}</span>
                    <span className="pill pill-accent">{t('home.badges.actionable')}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate(hasStarted && nextTopic ? `/${nextTopic}` : '/passwords')}
                        className="btn btn-primary"
                        style={{ fontSize: '1.1rem', padding: '0.95rem 2.4rem' }}
                    >
                        {hasStarted ? t('progress.continue_learning') : t('progress.start')}
                    </button>
                    {!hasStarted && (
                        <button
                            onClick={() => navigate('/phishing')}
                            className="btn btn-glass"
                        >
                            <Sparkles size={18} /> {t('home.cta.quickstart')}
                        </button>
                    )}
                </div>
            </div>

            <ProgressCard />

            {/* Privacy vs Security Explainer */}
            <div className="section">
                <div className="grid grid-cols-2 gap-6">
                    <div className="card panel-solid" style={{ borderLeft: '4px solid var(--primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <Lock size={24} color="var(--primary)" />
                            <h3 style={{ margin: 0 }}>{t('home.security_vs_privacy.security.title')}</h3>
                        </div>
                        <p style={{ marginBottom: 0 }}>{t('home.security_vs_privacy.security.desc')}</p>
                    </div>
                    <div className="card panel-solid" style={{ borderLeft: '4px solid #00ff9d' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <Eye size={24} color="#00ff9d" />
                            <h3 style={{ margin: 0, color: '#00ff9d' }}>{t('home.security_vs_privacy.privacy.title')}</h3>
                        </div>
                        <p style={{ marginBottom: 0 }}>{t('home.security_vs_privacy.privacy.desc')}</p>
                    </div>
                </div>
            </div>

            {/* Recommended Stack */}
            <div className="section">
                <div className="section-header" style={{ alignItems: 'center' }}>
                    <div className="section-title">
                        <Shield size={22} color="#00ff9d" />
                        <h2 style={{ margin: 0 }}>{t('home.stack.title')}</h2>
                    </div>
                    <p className="section-subtitle" style={{ margin: 0 }}>{t('home.stack.subtitle')}</p>
                </div>
                <div className="grid grid-cols-4 gap-6">
                    <a href="https://bitwarden.com" target="_blank" rel="noopener noreferrer" className="card panel-solid stack-card" style={{ textDecoration: 'none' }}>
                        <div className="stack-icon">
                            <KeyRound size={28} color="var(--primary)" />
                        </div>
                        <h4 style={{ margin: '0.5rem 0 0.25rem', color: 'var(--text-main)' }}>Bitwarden</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>{t('home.stack.bitwarden')}</p>
                    </a>
                    <a href="https://brave.com" target="_blank" rel="noopener noreferrer" className="card panel-solid stack-card" style={{ textDecoration: 'none' }}>
                        <div className="stack-icon">
                            <Globe size={28} color="var(--primary)" />
                        </div>
                        <h4 style={{ margin: '0.5rem 0 0.25rem', color: 'var(--text-main)' }}>Brave</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>{t('home.stack.brave')}</p>
                    </a>
                    <a href="https://proton.me/mail" target="_blank" rel="noopener noreferrer" className="card panel-solid stack-card" style={{ textDecoration: 'none' }}>
                        <div className="stack-icon">
                            <Mail size={28} color="var(--primary)" />
                        </div>
                        <h4 style={{ margin: '0.5rem 0 0.25rem', color: 'var(--text-main)' }}>Proton Mail</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>{t('home.stack.protonmail')}</p>
                    </a>
                    <a href="https://signal.org" target="_blank" rel="noopener noreferrer" className="card panel-solid stack-card" style={{ textDecoration: 'none' }}>
                        <div className="stack-icon">
                            <Smartphone size={28} color="var(--primary)" />
                        </div>
                        <h4 style={{ margin: '0.5rem 0 0.25rem', color: 'var(--text-main)' }}>Signal</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>{t('home.stack.signal')}</p>
                    </a>
                </div>
                <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
                    <Lock size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <p style={{ margin: 0 }}><strong>{t('home.stack.mfa_reminder.title')}</strong> {t('home.stack.mfa_reminder.desc')}</p>
                </div>
            </div>

            <div className="section">
                <div className="section-header" style={{ alignItems: 'center' }}>
                    <div className="section-title">
                        <Sparkles size={22} color="var(--primary)" />
                        <h2 style={{ margin: 0 }}>{t('home.preview_title')}</h2>
                    </div>
                    <p className="section-subtitle" style={{ margin: 0 }}>{t('home.preview_subtitle')}</p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {topics.map((topic) => {
                        const topicId = topic.path.slice(1);
                        const isCompleted = isTopicCompleted(topicId);
                        return (
                            <button
                                key={topic.path}
                                className="card panel-solid"
                                style={{
                                    textAlign: 'left',
                                    borderColor: isCompleted ? 'rgba(0, 255, 157, 0.3)' : 'rgba(255,255,255,0.08)',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                                onClick={() => navigate(topic.path)}
                            >
                                {isCompleted && (
                                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                                        <CheckCircle size={20} color="#00ff9d" />
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <div className="icon-box" style={{ marginBottom: 0 }}>{topic.icon}</div>
                                    <div>
                                        <h3 style={{ margin: 0 }}>{topic.label}</h3>
                                        <div className="pill" style={{ marginTop: '0.3rem', fontSize: '0.85rem' }}>{topic.time}</div>
                                    </div>
                                </div>
                                <p style={{ marginBottom: 0 }}>{topic.desc}</p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Home;
