import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.div
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, Users, Server, Lock, Unlock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import VizContainer from './VizContainer';
import AnimationControls from './AnimationControls';
import StepCaption from './StepCaption';
import { useAnimationControl } from './useAnimationControl';
import { tArray } from '../../i18n/safeTranslate';

const E2eEncryptionViz = () => {
    const { t } = useTranslation();
    const [mode, setMode] = useState('e2e');
    const isE2e = mode === 'e2e';

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
        interval: 1200,
        loop: true,
        autoPlay: false
    });

    const handleModeChange = (nextMode) => {
        if (nextMode === mode) return;
        setMode(nextMode);
        goToStep(0);
    };

    // Animation cycle: 0=start, 1=encrypting, 2=in-transit, 3=decrypting, 4=received
    const inTransit = currentStep >= 1 && currentStep <= 3;
    const isEncrypted = isE2e && inTransit;

    const getMessage = () => {
        if (isEncrypted) return '••••••••';
        return t('visualizations.e2e.message');
    };

    const messageVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
    };

    const arrowVariants = {
        animate: {
            x: [0, 5, 0],
            transition: {
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <VizContainer
            title={t('visualizations.e2e.title')}
            whyItMatters={t('visualizations.e2e.why_matters')}
        >
            <div className="e2e-viz-wrapper">
                {/* Mode Toggle */}
                <div className="viz-mode-toggle">
                    <button
                        className={!isE2e ? 'active' : ''}
                        aria-pressed={!isE2e}
                        onClick={() => handleModeChange('regular')}
                    >
                        {t('visualizations.e2e.mode_regular')}
                    </button>
                    <button
                        className={isE2e ? 'active' : ''}
                        aria-pressed={isE2e}
                        onClick={() => handleModeChange('e2e')}
                    >
                        {t('visualizations.e2e.mode_e2e')}
                    </button>
                </div>

                {/* Main Flow */}
                <div className="e2e-flow">
                    {/* Sender */}
                    <div className="viz-node" style={{ borderColor: currentStep === 0 ? 'var(--primary)' : 'var(--border-light)' }}>
                        <div className="viz-node-icon">
                            <User size={20} color={currentStep === 0 ? 'var(--primary)' : 'var(--text-muted)'} />
                        </div>
                        <span className="viz-node-label">{t('visualizations.e2e.you')}</span>
                    </div>

                    {/* Lock Icon */}
                    <motion.div
                        style={{ color: isE2e && currentStep === 1 ? 'var(--primary)' : 'var(--text-dim)' }}
                        animate={!prefersReducedMotion && isE2e && currentStep === 1 ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        {isE2e ? <Lock size={16} /> : <Unlock size={16} />}
                    </motion.div>

                    {/* Arrow */}
                    <motion.div
                        variants={!prefersReducedMotion ? arrowVariants : undefined}
                        animate={!prefersReducedMotion && currentStep === 2 ? 'animate' : undefined}
                        style={{ color: 'var(--text-dim)' }}
                    >
                        <ArrowRight size={16} />
                    </motion.div>

                    {/* Message Bubble */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isEncrypted ? 'encrypted' : 'readable'}
                            className={`e2e-message ${isEncrypted ? 'encrypted' : 'readable'}`}
                            variants={!prefersReducedMotion ? messageVariants : undefined}
                            initial={!prefersReducedMotion ? 'initial' : undefined}
                            animate="animate"
                            exit={!prefersReducedMotion ? 'exit' : undefined}
                            transition={{ duration: 0.2 }}
                        >
                            {isEncrypted && <Lock size={12} style={{ marginRight: '4px' }} />}
                            {getMessage()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Arrow */}
                    <motion.div
                        variants={!prefersReducedMotion ? arrowVariants : undefined}
                        animate={!prefersReducedMotion && currentStep === 2 ? 'animate' : undefined}
                        style={{ color: 'var(--text-dim)' }}
                    >
                        <ArrowRight size={16} />
                    </motion.div>

                    {/* Unlock Icon */}
                    <motion.div
                        style={{ color: isE2e && currentStep === 3 ? 'var(--primary)' : 'var(--text-dim)' }}
                        animate={!prefersReducedMotion && isE2e && currentStep === 3 ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        <Unlock size={16} />
                    </motion.div>

                    {/* Recipient */}
                    <div className="viz-node" style={{ borderColor: currentStep === 4 ? '#00ff9d' : 'var(--border-light)' }}>
                        <div className="viz-node-icon">
                            <Users size={20} color={currentStep === 4 ? '#00ff9d' : 'var(--text-muted)'} />
                        </div>
                        <span className="viz-node-label">{t('visualizations.e2e.friend')}</span>
                    </div>
                </div>

                {/* Server Note */}
                <motion.div
                    className="e2e-server-note"
                    style={!isE2e && inTransit ? {
                        color: 'var(--accent)',
                        border: '1px solid rgba(255, 0, 85, 0.35)',
                    } : undefined}
                    animate={{
                        opacity: inTransit ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <Server size={14} />
                    {isE2e ? <EyeOff size={12} /> : <Eye size={12} />}
                    <span>
                        {isE2e
                            ? t('visualizations.e2e.server_blind')
                            : t('visualizations.e2e.server_reads')
                        }
                    </span>
                </motion.div>

                <StepCaption
                    steps={tArray(t, isE2e ? 'visualizations.e2e.steps' : 'visualizations.e2e.steps_regular')}
                    currentStep={currentStep}
                />

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

export default E2eEncryptionViz;
