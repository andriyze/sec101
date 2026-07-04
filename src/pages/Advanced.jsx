import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Globe, Server, Network, Shield, Lock, Wifi } from 'lucide-react';
import Quiz from '../components/Quiz';
import TopicCompletionCard from '../components/TopicCompletionCard';
import DnsResolutionViz from '../components/visualizations/DnsResolutionViz';
import OsiModelViz from '../components/visualizations/OsiModelViz';
import PortsViz from '../components/visualizations/PortsViz';
import ProtocolsViz from '../components/visualizations/ProtocolsViz';
import FirewallViz from '../components/visualizations/FirewallViz';
import TlsHandshakeViz from '../components/visualizations/TlsHandshakeViz';
import IpVersionsViz from '../components/visualizations/IpVersionsViz';
import { tArray } from '../i18n/safeTranslate';

const Advanced = () => {
    const { t } = useTranslation();
    const quizQuestions = tArray(t, 'advanced.quiz.questions');
    const webSecurityItems = tArray(t, 'advanced.web_security.items');
    const webSecurityFlow = tArray(t, 'advanced.web_security.flow_steps');

    return (
        <div className="animate-fade-in">
            <div className="section-header">
                <div className="section-title">
                    <Cpu color="var(--primary)" size={40} />
                    <h2 style={{ margin: 0 }}>{t('advanced.title')}</h2>
                </div>
                <p className="section-subtitle">{t('advanced.subtitle')}</p>
            </div>

            {/* DNS Section */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <Globe size={24} color="var(--primary)" /> <h3 style={{ margin: 0 }}>{t('advanced.dns.title')}</h3>
                </div>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>{t('advanced.dns.intro')}</p>
                <DnsResolutionViz />
            </section>

            {/* OSI Model Section */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <Server size={24} color="var(--secondary)" /> <h3 style={{ margin: 0 }}>{t('advanced.osi.title')}</h3>
                </div>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>{t('advanced.osi.intro')}</p>
                <OsiModelViz />
            </section>

            {/* Ports Section */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <Network size={24} color="#00ff9d" /> <h3 style={{ margin: 0 }}>{t('advanced.ports.title')}</h3>
                </div>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>{t('advanced.ports.intro')}</p>
                <PortsViz />
            </section>

            {/* Protocols Section */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <Wifi size={24} color="var(--primary)" /> <h3 style={{ margin: 0 }}>{t('advanced.protocols.title')}</h3>
                </div>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>{t('advanced.protocols.intro')}</p>
                <ProtocolsViz />
            </section>

            {/* Firewalls Section */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <Shield size={24} color="var(--accent)" /> <h3 style={{ margin: 0 }}>{t('advanced.firewall.title')}</h3>
                </div>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>{t('advanced.firewall.intro')}</p>
                <FirewallViz />
            </section>

            {/* TLS Handshake Section */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <Lock size={24} color="#00ff9d" /> <h3 style={{ margin: 0 }}>{t('advanced.tls.title')}</h3>
                </div>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>{t('advanced.tls.intro')}</p>
                <TlsHandshakeViz />
            </section>

            {/* IPv4 vs IPv6 Section */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <Globe size={24} color="var(--secondary)" /> <h3 style={{ margin: 0 }}>{t('advanced.ipv.title')}</h3>
                </div>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>{t('advanced.ipv.intro')}</p>
                <IpVersionsViz />
            </section>

            {/* Web App Security Section */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <Shield size={24} color="var(--primary)" /> <h3 style={{ margin: 0 }}>{t('advanced.web_security.title')}</h3>
                </div>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>{t('advanced.web_security.intro')}</p>

                <div className="grid grid-cols-2 gap-6">
                    {webSecurityItems.map(item => (
                        <div key={item.title} className="card panel-solid">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div className="icon-box" style={{ marginBottom: 0, fontSize: '0.95rem', fontWeight: 700 }}>
                                    {item.tag}
                                </div>
                                <h4 style={{ margin: 0 }}>{item.title}</h4>
                            </div>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{item.desc}</p>
                            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                {(item.points || []).map(point => (
                                    <li key={point} style={{ marginBottom: '0.25rem' }}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="card panel-solid" style={{ marginTop: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                    <h4 style={{ marginBottom: '0.75rem' }}>{t('advanced.web_security.flow_title')}</h4>
                    <ol style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        {webSecurityFlow.map(step => (
                            <li key={step} style={{ marginBottom: '0.35rem' }}>{step}</li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Quiz */}
            <section className="section">
                <Quiz
                    title={t('advanced.quiz.title')}
                    questions={quizQuestions}
                    storageKey="quiz-advanced"
                />
            </section>

            <TopicCompletionCard topicId="advanced" quizStorageKey="quiz-advanced" />
        </div>
    );
};

export default Advanced;
