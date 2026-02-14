import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import { Smartphone, Laptop, ShieldCheck } from 'lucide-react';
import Quiz from '../components/Quiz';
import TopicCompletionCard from '../components/TopicCompletionCard';

const Devices = () => {
    const { t } = useTranslation();
    const checklistItems = t('devices.checklist_items', { returnObjects: true });
    const emptyChecklistState = () => Array(checklistItems.length).fill(false);
    const normalizeChecklistState = (value) =>
        Array.from({ length: checklistItems.length }, (_, i) => Boolean(value?.[i]));

    const [completed, setCompleted] = useState(() => {
        if (typeof window === 'undefined') return emptyChecklistState();
        const cached = window.localStorage.getItem('devices-checklist');
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                return Array.isArray(parsed) ? normalizeChecklistState(parsed) : emptyChecklistState();
            } catch {
                return emptyChecklistState();
            }
        }
        return emptyChecklistState();
    });

    const toggleItem = (index) => {
        setCompleted((prev) => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    };

    useEffect(() => {
        window.localStorage.setItem('devices-checklist', JSON.stringify(completed));
    }, [completed]);

    return (
        <div className="animate-fade-in">
            <div className="section-header">
                <div className="section-title">
                    <Smartphone color="var(--primary)" size={40} />
                    <h2 style={{ margin: 0 }}>{t('nav.devices')}</h2>
                </div>
                <p className="section-subtitle">{t('devices.subtitle')}</p>
            </div>

            {/* Mobile Security Checklist */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <ShieldCheck size={24} color="#00ff9d" /> <h3 style={{ margin: 0 }}>{t('devices.mobile_checklist')}</h3>
                </div>
                <div className="checklist">
                    {checklistItems.map((item, i) => (
                        <button
                            key={i}
                            className={`checklist-item ${completed[i] ? 'completed' : ''}`}
                            onClick={() => toggleItem(i)}
                            aria-pressed={completed[i]}
                        >
                            <span className="circle">{completed[i] ? '✓' : ''}</span>
                            <span style={{ fontWeight: 600 }}>{item}</span>
                        </button>
                    ))}
                </div>
            </section>

            <section className="section">
                <div className="grid grid-cols-2 gap-6">
                    <div className="card panel-solid">
                        <h4 style={{ marginBottom: '0.5rem' }}>{t('devices.resilience.title')}</h4>
                        <ul style={{ paddingLeft: '1.2rem' }}>
                            {t('devices.resilience.items', { returnObjects: true }).map((item, i) => (
                                <li key={i} style={{ marginBottom: '0.35rem' }}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="card panel-solid">
                        <h4 style={{ marginBottom: '0.5rem' }}>{t('devices.lost_device.title')}</h4>
                        <ol style={{ paddingLeft: '1.2rem' }}>
                            {t('devices.lost_device.steps', { returnObjects: true }).map((item, i) => (
                                <li key={i} style={{ marginBottom: '0.35rem' }}>{item}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>

            {/* iOS Apps */}
            <section className="section">
                <h3 style={{ marginBottom: '1.5rem' }}>{t('devices.ios_apps.title')}</h3>
                <div className="grid grid-cols-3 gap-6">
                    <Card
                        title="Signal"
                        icon="💬"
                        description={t('devices.ios_apps.signal')}
                        link="https://apps.apple.com/app/signal-private-messenger/id874139669"
                    />
                    <Card
                        title="Bitwarden"
                        icon="🛡️"
                        description={t('devices.ios_apps.bitwarden')}
                        link="https://apps.apple.com/app/bitwarden-password-manager/id1137397744"
                    />
                    <Card
                        title="Onion Browser"
                        icon="🧅"
                        description={t('devices.ios_apps.onion')}
                        link="https://apps.apple.com/app/onion-browser/id519296448"
                    />
                </div>
            </section>

            {/* Android Apps */}
            <section className="section">
                <h3 style={{ marginBottom: '1.5rem' }}>{t('devices.android_apps.title')}</h3>
                <div className="grid grid-cols-3 gap-6">
                    <Card
                        title="Signal"
                        icon="💬"
                        description={t('devices.android_apps.signal')}
                        link="https://play.google.com/store/apps/details?id=org.thoughtcrime.securesms"
                    />
                    <Card
                        title="2FAS"
                        icon="🔐"
                        description={t('devices.android_apps.twofas')}
                        link="https://play.google.com/store/apps/details?id=com.twofasapp"
                    />
                    <Card
                        title="Orbot"
                        icon="🧅"
                        description={t('devices.android_apps.orbot')}
                        link="https://play.google.com/store/apps/details?id=org.torproject.android"
                    />
                </div>
            </section>

            {/* Desktop Software */}
            <section className="section">
                <div className="section-title" style={{ marginBottom: '1rem' }}>
                    <Laptop size={24} color="var(--primary)" /> <h3 style={{ margin: 0 }}>{t('devices.desktop_tools.title')}</h3>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <Card
                        title="Bitwarden"
                        icon="🛡️"
                        description={t('devices.desktop_tools.bitwarden')}
                        link="https://bitwarden.com/download"
                    />
                    <Card
                        title="Mullvad VPN"
                        icon="🔒"
                        description={t('devices.desktop_tools.mullvad')}
                        link="https://mullvad.net/download"
                    />
                    <Card
                        title="Firefox"
                        icon="🦊"
                        description={t('devices.desktop_tools.firefox')}
                        link="https://www.mozilla.org/firefox/new/"
                    />
                </div>
            </section>

            <section className="section">
                <Quiz
                    title={t('devices.quiz.title')}
                    questions={t('devices.quiz.questions', { returnObjects: true })}
                    storageKey="quiz-devices"
                />
            </section>

            <TopicCompletionCard topicId="devices" quizStorageKey="quiz-devices" />
        </div>
    );
};

export default Devices;
