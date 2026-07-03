import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.div
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock, Unlock, Check, X, Zap } from 'lucide-react';
import VizContainer from './VizContainer';
import AnimationControls from './AnimationControls';
import StepCaption from './StepCaption';
import { useAnimationControl } from './useAnimationControl';
import { tArray } from '../../i18n/safeTranslate';

const ProtocolsViz = () => {
    const { t } = useTranslation();
    const [comparison, setComparison] = useState('http'); // 'http' or 'tcp'

    const {
        currentStep,
        isPlaying,
        totalSteps,
        nextStep,
        prevStep,
        goToStep,
        togglePlay,
        reset,
        prefersReducedMotion
    } = useAnimationControl({
        totalSteps: 4,
        interval: 4000,
        loop: true
    });

    // Handle comparison toggle
    const handleComparisonChange = (newComparison) => {
        setComparison(newComparison);
        reset(); // Reset animation when switching
    };

    const packetVariants = {
        hidden: { x: -50, opacity: 0 },
        visible: { x: 0, opacity: 1 },
        sent: { x: 150, opacity: 0, transition: { duration: 0.8 } }
    };

    return (
        <VizContainer
            title={t('visualizations.protocols.title')}
            whyItMatters={t('visualizations.protocols.why_matters')}
        >
            <div className="protocols-viz-wrapper">
                {/* Comparison toggle */}
                <div className="protocols-toggle">
                    <button
                        className={`protocols-toggle-btn ${comparison === 'http' ? 'active' : ''}`}
                        onClick={() => handleComparisonChange('http')}
                    >
                        {t('visualizations.protocols.toggle_web')}
                    </button>
                    <button
                        className={`protocols-toggle-btn ${comparison === 'tcp' ? 'active' : ''}`}
                        onClick={() => handleComparisonChange('tcp')}
                    >
                        {t('visualizations.protocols.toggle_transport')}
                    </button>
                </div>

                {comparison === 'http' ? (
                    <div className="protocols-comparison">
                        {/* HTTP Lane */}
                        <div className="protocols-lane http">
                            <div className="protocols-lane-header">
                                <Unlock size={16} color="var(--accent)" />
                                <span>{t('visualizations.protocols.http_label')}</span>
                            </div>
                            <div className="protocols-lane-track">
                                <AnimatePresence>
                                    {currentStep >= 1 && !prefersReducedMotion && (
                                        <motion.div
                                            className="protocols-packet plain"
                                            variants={packetVariants}
                                            initial="hidden"
                                            animate={currentStep >= 3 ? 'sent' : 'visible'}
                                            exit="sent"
                                        >
                                            <span>{t('visualizations.protocols.message')}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="protocols-watcher">
                                    <Eye size={18} color="var(--accent)" />
                                    <span>{t('visualizations.protocols.visible')}</span>
                                </div>
                            </div>
                        </div>

                        {/* HTTPS Lane */}
                        <div className="protocols-lane https">
                            <div className="protocols-lane-header">
                                <Lock size={16} color="#00ff9d" />
                                <span>{t('visualizations.protocols.https_label')}</span>
                            </div>
                            <div className="protocols-lane-track">
                                <AnimatePresence>
                                    {currentStep >= 1 && !prefersReducedMotion && (
                                        <motion.div
                                            className="protocols-packet encrypted"
                                            variants={packetVariants}
                                            initial="hidden"
                                            animate={currentStep >= 3 ? 'sent' : 'visible'}
                                            exit="sent"
                                        >
                                            <Lock size={14} />
                                            <span>***</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="protocols-watcher safe">
                                    <EyeOff size={18} color="#00ff9d" />
                                    <span>{t('visualizations.protocols.encrypted')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="protocols-comparison">
                        {/* TCP Lane */}
                        <div className="protocols-lane tcp">
                            <div className="protocols-lane-header">
                                <Check size={16} color="#00ff9d" />
                                <span>{t('visualizations.protocols.tcp_label')}</span>
                            </div>
                            <div className="protocols-lane-track">
                                <div className="protocols-packets-row">
                                    {[1, 2, 3].map((num) => (
                                        <motion.div
                                            key={num}
                                            className="protocols-packet tcp-packet"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{
                                                opacity: currentStep >= num ? 1 : 0.3,
                                                y: 0
                                            }}
                                            transition={{ delay: num * 0.2 }}
                                        >
                                            {num}
                                        </motion.div>
                                    ))}
                                </div>
                                <span className="protocols-trait">{t('visualizations.protocols.reliable')}</span>
                            </div>
                        </div>

                        {/* UDP Lane */}
                        <div className="protocols-lane udp">
                            <div className="protocols-lane-header">
                                <Zap size={16} color="#ffa94d" />
                                <span>{t('visualizations.protocols.udp_label')}</span>
                            </div>
                            <div className="protocols-lane-track">
                                <div className="protocols-packets-row">
                                    {[1, 2, 3].map((num) => (
                                        <motion.div
                                            key={num}
                                            className={`protocols-packet udp-packet ${num === 2 ? 'lost' : ''}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{
                                                opacity: currentStep >= 1 ? (num === 2 ? 0.3 : 1) : 0.3,
                                                y: 0,
                                                scale: num === 2 && currentStep >= 2 ? 0.8 : 1
                                            }}
                                            transition={{ delay: num * 0.1 }}
                                        >
                                            {num === 2 ? <X size={12} /> : num}
                                        </motion.div>
                                    ))}
                                </div>
                                <span className="protocols-trait">{t('visualizations.protocols.fast')}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step narration (follows the active comparison mode) */}
                <StepCaption
                    steps={tArray(
                        t,
                        comparison === 'http'
                            ? 'visualizations.protocols.steps_web'
                            : 'visualizations.protocols.steps_transport'
                    )}
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

export default ProtocolsViz;
