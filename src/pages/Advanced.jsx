import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Globe, Server, Network, Shield, Lock, Wifi } from 'lucide-react';
import Quiz from '../components/Quiz';
import NextTopicCard from '../components/NextTopicCard';
import { useProgress } from '../hooks/useProgress';
import DnsResolutionViz from '../components/visualizations/DnsResolutionViz';
import OsiModelViz from '../components/visualizations/OsiModelViz';
import PortsViz from '../components/visualizations/PortsViz';
import ProtocolsViz from '../components/visualizations/ProtocolsViz';
import FirewallViz from '../components/visualizations/FirewallViz';
import TlsHandshakeViz from '../components/visualizations/TlsHandshakeViz';
import IpVersionsViz from '../components/visualizations/IpVersionsViz';

const Advanced = () => {
    const { t } = useTranslation();
    const { markTopicComplete } = useProgress();
    const quizQuestions = t('advanced.quiz.questions', { returnObjects: true, defaultValue: [] }) || [];

    const handleQuizComplete = () => {
        markTopicComplete('advanced', 'quiz');
    };

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

            {/* Quiz */}
            <section className="section">
                <Quiz
                    title={t('advanced.quiz.title')}
                    questions={quizQuestions}
                    storageKey="quiz-advanced"
                    onComplete={handleQuizComplete}
                />
            </section>

            <NextTopicCard currentTopic="advanced" />
        </div>
    );
};

export default Advanced;
