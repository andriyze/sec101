import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, Users, Server, Lock, Unlock, EyeOff, ArrowRight } from 'lucide-react';
import VizContainer from './VizContainer';
import AnimationControls from './AnimationControls';
import { useAnimationControl } from './useAnimationControl';

const E2eEncryptionViz = () => {
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
        interval: 1200,
        loop: true,
        autoPlay: false
    });

    // Animation cycle: 0=start, 1=encrypting, 2=in-transit, 3=decrypting, 4=received
    const getMessage = () => {
        if (currentStep <= 0) return t('visualizations.e2e.message');
        if (currentStep >= 4) return t('visualizations.e2e.message');
        return '••••••••';
    };

    const isEncrypted = currentStep >= 1 && currentStep <= 3;

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
        <VizContainer title={t('visualizations.e2e.title')}>
            <div className="e2e-viz-wrapper">
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
                        style={{ color: currentStep === 1 ? 'var(--primary)' : 'var(--text-dim)' }}
                        animate={!prefersReducedMotion && currentStep === 1 ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        <Lock size={16} />
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
                        style={{ color: currentStep === 3 ? 'var(--primary)' : 'var(--text-dim)' }}
                        animate={!prefersReducedMotion && currentStep === 3 ? { scale: [1, 1.2, 1] } : {}}
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
                    animate={{
                        opacity: isEncrypted ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <Server size={14} />
                    <EyeOff size={12} />
                    <span>{t('visualizations.e2e.server_blind')}</span>
                </motion.div>

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
