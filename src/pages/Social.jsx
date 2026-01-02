import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import { MessageCircle, Shield, Globe, Lock, Info, Mail } from 'lucide-react';
import Quiz from '../components/Quiz';
import TopicCompletionCard from '../components/TopicCompletionCard';
import VpnTunnelViz from '../components/visualizations/VpnTunnelViz';
import E2eEncryptionViz from '../components/visualizations/E2eEncryptionViz';

const Social = () => {
    const { t } = useTranslation();
    const quizQuestions = t('social.quiz.questions', { returnObjects: true, defaultValue: [] }) || [];

    return (
        <div className="animate-fade-in">
            <div className="section-header">
                <div className="section-title">
                    <MessageCircle color="var(--primary)" size={40} />
                    <h2 style={{ margin: 0 }}>{t('nav.social')}</h2>
                </div>
                <p className="section-subtitle">{t('social.subtitle')}</p>
            </div>

            {/* Messaging Section */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <Lock size={24} color="#00ff9d" /> <h3 style={{ margin: 0 }}>{t('social.messaging.title')}</h3>
                </div>

                {/* E2E Explanation */}
                <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
                    <Info size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <div className="alert-content">
                        <h3>{t('social.messaging.e2e_explanation.title')}</h3>
                        <p>{t('social.messaging.e2e_explanation.desc')}</p>
                    </div>
                </div>

                {/* E2E Visualization */}
                <E2eEncryptionViz />

                <div className="grid grid-cols-2 gap-6">
                    <div className="card card-recommended">
                        <span className="recommended-badge">{t('common.recommended')}</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <div className="icon-box">💬</div>
                            <h3 style={{ margin: '0 0 0 1rem' }}>Signal</h3>
                        </div>
                        <p>{t('social.messaging.signal.desc')}</p>
                        <a href="https://signal.org" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', marginTop: '1rem', fontWeight: 600 }}>
                            {t('common.get')} Signal <span style={{ marginLeft: '5px' }}>→</span>
                        </a>
                    </div>
                    <Card
                        title="WhatsApp"
                        icon="📞"
                        description={t('social.messaging.whatsapp.desc')}
                        link="https://whatsapp.com"
                        linkText={t('common.get') + " WhatsApp"}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6" style={{ marginTop: '1.5rem' }}>
                    <div className="card panel-solid">
                        <h4 style={{ marginBottom: '0.5rem' }}>{t('social.metadata.title')}</h4>
                        <ul style={{ paddingLeft: '1.2rem' }}>
                            {t('social.metadata.points', { returnObjects: true }).map((item, i) => (
                                <li key={i} style={{ marginBottom: '0.35rem' }}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="card panel-solid">
                        <h4 style={{ marginBottom: '0.5rem' }}>{t('social.verification.title')}</h4>
                        <ol style={{ paddingLeft: '1.2rem' }}>
                            {t('social.verification.steps', { returnObjects: true }).map((item, i) => (
                                <li key={i} style={{ marginBottom: '0.35rem' }}>{item}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>

            {/* VPN Section */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <Globe size={24} color="var(--primary)" /> <h3 style={{ margin: 0 }}>{t('social.vpn.title')}</h3>
                </div>

                {/* VPN Explanation */}
                <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
                    <Shield size={24} color="#ffcc00" style={{ flexShrink: 0 }} />
                    <div className="alert-content">
                        <h3>{t('social.vpn.explanation.title')}</h3>
                        <p>{t('social.vpn.explanation.desc')}</p>
                    </div>
                </div>

                {/* VPN Visualization */}
                <VpnTunnelViz />

                <p style={{ marginBottom: '1.5rem' }}>
                    {t('social.vpn.intro')}
                </p>

                <div className="grid grid-cols-3 gap-6">
                    <div className="card card-recommended">
                        <span className="recommended-badge">{t('common.recommended')}</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <div className="icon-box">🔐</div>
                            <h3 style={{ margin: '0 0 0 1rem' }}>Mullvad</h3>
                        </div>
                        <p>{t('social.vpn.mullvad')}</p>
                        <a href="https://mullvad.net" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', marginTop: '1rem', fontWeight: 600 }}>
                            {t('common.get')} Mullvad <span style={{ marginLeft: '5px' }}>→</span>
                        </a>
                    </div>
                    <Card
                        title="ProtonVPN"
                        icon="🛡️"
                        description={t('social.vpn.proton')}
                        link="https://protonvpn.com"
                        linkText={t('common.get') + " ProtonVPN"}
                    />
                    <Card
                        title="IVPN"
                        icon="⚡"
                        description={t('social.vpn.ivpn')}
                        link="https://www.ivpn.net"
                        linkText={t('common.get') + " IVPN"}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6" style={{ marginTop: '1.5rem' }}>
                    <div className="card">
                        <h4>{t('social.wifi.title')}</h4>
                        <ul style={{ paddingLeft: '1.2rem' }}>
                            {t('social.wifi.items', { returnObjects: true }).map((item, i) => (
                                <li key={i} style={{ marginBottom: '0.35rem' }}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="card">
                        <h4>{t('social.wifi.donts_title')}</h4>
                        <ul style={{ paddingLeft: '1.2rem' }}>
                            {t('social.wifi.donts', { returnObjects: true }).map((item, i) => (
                                <li key={i} style={{ marginBottom: '0.35rem' }}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Email Section */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <Mail size={24} color="var(--primary)" /> <h3 style={{ margin: 0 }}>{t('social.email.title')}</h3>
                </div>

                <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
                    <Info size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <div className="alert-content">
                        <p style={{ margin: 0 }}>{t('social.email.why')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="card card-recommended">
                        <span className="recommended-badge">{t('common.recommended')}</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <div className="icon-box">🟣</div>
                            <h3 style={{ margin: '0 0 0 1rem' }}>Proton Mail</h3>
                        </div>
                        <p>{t('social.email.proton.desc')}</p>
                        <a href="https://proton.me/mail" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', marginTop: '1rem', fontWeight: 600 }}>
                            {t('common.get')} Proton Mail <span style={{ marginLeft: '5px' }}>→</span>
                        </a>
                    </div>
                    <div className="card" style={{ borderColor: 'rgba(255, 59, 48, 0.3)', background: 'rgba(255, 59, 48, 0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                            <div className="icon-box">📧</div>
                            <h3 style={{ margin: '0 0 0 1rem', color: 'var(--text-muted)' }}>Gmail</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>{t('social.email.gmail.desc')}</p>
                    </div>
                </div>
            </section>

            {/* Quiz */}
            <section className="section">
                <Quiz
                    title={t('social.quiz.title')}
                    questions={quizQuestions}
                    storageKey="quiz-social"
                />
            </section>

            <TopicCompletionCard topicId="social" quizStorageKey="quiz-social" />
        </div>
    );
};

export default Social;
