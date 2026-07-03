import React from 'react';
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.div
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Monitor, Shield, Globe, Check, X } from 'lucide-react';
import VizContainer from './VizContainer';
import AnimationControls from './AnimationControls';
import StepCaption from './StepCaption';
import { useAnimationControl } from './useAnimationControl';
import { tArray } from '../../i18n/safeTranslate';

const RULES = [
    { port: 443, allowed: true, labelKey: 'rule_web_secure' },
    { port: 80, allowed: true, labelKey: 'rule_web' },
    { port: 23, allowed: false, labelKey: 'rule_telnet' }
];

// Scripted packet for each step (steps 0 and 4 show no traveling packet)
const STEP_PACKETS = {
    1: { port: 443, allowed: true },
    2: { port: 80, allowed: true },
    3: { port: 23, allowed: false }
};

const FirewallViz = () => {
    const { t } = useTranslation();

    const {
        currentStep,
        isPlaying,
        totalSteps,
        nextStep,
        prevStep,
        goToStep,
        togglePlay,
        prefersReducedMotion
    } = useAnimationControl({
        totalSteps: 5,
        interval: 4000
    });

    const activePacket = STEP_PACKETS[currentStep];
    const checkedPort = activePacket ? activePacket.port : null;
    // Emphasize the shield/doorman on the intro and summary steps
    const shieldEmphasized = currentStep === 0 || currentStep === 4;

    return (
        <VizContainer
            title={t('visualizations.firewall.title')}
            whyItMatters={t('visualizations.firewall.why_matters')}
        >
            <div className="firewall-viz-wrapper">
                {/* Network zones */}
                <div className="firewall-zones">
                    {/* External */}
                    <div className="firewall-zone external">
                        <Globe size={24} color="var(--accent)" />
                        <span>{t('visualizations.firewall.external')}</span>
                    </div>

                    {/* Firewall */}
                    <motion.div
                        className="firewall-wall"
                        initial={false}
                        animate={{
                            scale: shieldEmphasized ? 1.04 : 1,
                            boxShadow: shieldEmphasized
                                ? '0 0 24px rgba(112, 0, 255, 0.45)'
                                : '0 0 0px rgba(112, 0, 255, 0)'
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <Shield size={28} color="var(--primary)" />
                        <div className="firewall-rules">
                            {RULES.map((rule) => {
                                const isChecking = checkedPort === rule.port;
                                return (
                                    <motion.span
                                        key={rule.port}
                                        className={`firewall-rule ${rule.allowed ? 'allow' : 'deny'}`}
                                        initial={false}
                                        animate={{
                                            scale: isChecking ? 1.1 : 1,
                                            boxShadow: isChecking
                                                ? (rule.allowed
                                                    ? '0 0 10px rgba(0, 255, 157, 0.6)'
                                                    : '0 0 10px rgba(255, 0, 85, 0.6)')
                                                : '0 0 0px rgba(0, 0, 0, 0)'
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        :{rule.port} {rule.allowed ? '✓' : '✗'}
                                        <span style={{ marginLeft: '0.35em', opacity: 0.85 }}>
                                            {t(`visualizations.firewall.${rule.labelKey}`)}
                                        </span>
                                    </motion.span>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Internal */}
                    <div className="firewall-zone internal">
                        <Monitor size={24} color="#00ff9d" />
                        <span>{t('visualizations.firewall.internal')}</span>
                    </div>
                </div>

                {/* Packet flow */}
                <div className="firewall-packets" style={{ gap: '1rem' }}>
                    {activePacket && !prefersReducedMotion && (
                        <motion.div
                            key={`packet-${currentStep}`}
                            className={`firewall-packet ${activePacket.allowed ? 'allowed' : 'blocked'}`}
                            initial={{ x: -140, opacity: 0 }}
                            animate={{
                                x: activePacket.allowed
                                    ? [-140, 0, 0, 140]
                                    : [-140, 0, 0, -100],
                                opacity: [0, 1, 1, activePacket.allowed ? 0.7 : 0.85]
                            }}
                            transition={{ duration: 3.4, times: [0, 0.3, 0.65, 1], ease: 'easeInOut' }}
                        >
                            <span className="firewall-packet-port">:{activePacket.port}</span>
                            <motion.span
                                className="firewall-checking"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
                                transition={{ duration: 3.4, times: [0, 0.3, 0.38, 0.55, 0.63, 1] }}
                            >
                                {t('visualizations.firewall.checking')}
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0, 1] }}
                                transition={{ duration: 3.4, times: [0, 0.63, 0.75] }}
                                style={{ display: 'inline-flex', alignItems: 'center' }}
                            >
                                {activePacket.allowed ? <Check size={12} /> : <X size={12} />}
                            </motion.span>
                        </motion.div>
                    )}

                    {/* Summary step: one allowed + one blocked, shown statically */}
                    {currentStep === 4 && (
                        <>
                            <div className="firewall-packet allowed" style={{ position: 'static' }}>
                                <span className="firewall-packet-port">:443</span>
                                <Check size={12} />
                            </div>
                            <div className="firewall-packet blocked" style={{ position: 'static' }}>
                                <span className="firewall-packet-port">:23</span>
                                <X size={12} />
                            </div>
                        </>
                    )}
                </div>

                {/* Legend */}
                <div className="firewall-legend">
                    <span className="firewall-legend-item allowed">
                        <Check size={12} /> {t('visualizations.firewall.allowed')}
                    </span>
                    <span className="firewall-legend-item blocked">
                        <X size={12} /> {t('visualizations.firewall.blocked')}
                    </span>
                </div>

                {/* Step narration */}
                <StepCaption
                    steps={tArray(t, 'visualizations.firewall.steps')}
                    currentStep={currentStep}
                />

                {/* Animation Controls */}
                <AnimationControls
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    isPlaying={isPlaying}
                    onPrev={prevStep}
                    onNext={nextStep}
                    onGoToStep={goToStep}
                    onTogglePlay={togglePlay}
                    disabled={prefersReducedMotion}
                />
            </div>
        </VizContainer>
    );
};

export default FirewallViz;
