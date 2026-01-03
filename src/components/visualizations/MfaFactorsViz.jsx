import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, ShieldCheck, Brain, Key, Fingerprint } from 'lucide-react';
import VizContainer from './VizContainer';
import AnimationControls from './AnimationControls';
import { useAnimationControl } from './useAnimationControl';

const MfaFactorsViz = () => {
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
        totalSteps: 4,
        interval: 2000,
        loop: true,
        autoPlay: false
    });

    const factors = [
        {
            id: 'knowledge',
            Icon: Brain,
            color: 'var(--primary)',
        },
        {
            id: 'possession',
            Icon: Key,
            color: 'var(--secondary)',
        },
        {
            id: 'inherence',
            Icon: Fingerprint,
            color: 'var(--accent)',
        },
    ];

    // Map step to active factors
    const factorStates = [
        ['knowledge'],
        ['knowledge', 'possession'],
        ['knowledge', 'possession', 'inherence'],
        ['knowledge', 'possession'],
    ];
    const activeFactors = prefersReducedMotion
        ? ['knowledge', 'possession']
        : factorStates[currentStep];

    const activeCount = activeFactors.length;
    const isStrong = activeCount >= 2;

    const cardVariants = {
        inactive: {
            scale: 1,
            opacity: 0.4,
        },
        active: {
            scale: 1.02,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20,
            },
        },
    };

    return (
        <VizContainer>
            <div className="mfa-viz-wrapper">
                {/* Explanation Header */}
                <div className="mfa-header">
                    <p className="mfa-explanation">
                        {t('visualizations.mfa.explanation')}
                    </p>
                </div>

                {/* Factors Row */}
                <div className="mfa-factors-row">
                    {factors.map((factor) => {
                        const isActive = activeFactors.includes(factor.id);
                        const Icon = factor.Icon;
                        return (
                            <motion.div
                                key={factor.id}
                                className={`mfa-factor-card ${factor.id} ${isActive ? 'active' : ''}`}
                                variants={!prefersReducedMotion ? cardVariants : undefined}
                                animate={!prefersReducedMotion ? (isActive ? 'active' : 'inactive') : undefined}
                                style={{
                                    borderColor: isActive ? factor.color : 'var(--border-light)',
                                    boxShadow: isActive ? `0 0 20px ${factor.color}30` : 'none',
                                }}
                            >
                                <div
                                    className="mfa-factor-icon-wrapper"
                                    style={{
                                        background: isActive ? `${factor.color}15` : 'rgba(255,255,255,0.03)',
                                    }}
                                >
                                    <Icon
                                        size={24}
                                        color={isActive ? factor.color : 'var(--text-dim)'}
                                    />
                                </div>
                                <div className="mfa-factor-title">
                                    {t(`visualizations.mfa.${factor.id}.title`)}
                                </div>
                                <div className="mfa-factor-examples">
                                    {t(`visualizations.mfa.${factor.id}.examples`)}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Result Indicator */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isStrong ? 'strong' : 'weak'}
                        className={`mfa-result ${isStrong ? 'strong' : 'weak'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isStrong ? (
                            <>
                                <ShieldCheck size={18} />
                                <span>
                                    <strong>{activeCount} {t('visualizations.mfa.factors')}</strong>
                                    {' — '}
                                    {t('visualizations.mfa.strong')}
                                </span>
                            </>
                        ) : (
                            <>
                                <ShieldAlert size={18} />
                                <span>
                                    <strong>{activeCount} {t('visualizations.mfa.factor')}</strong>
                                    {' — '}
                                    {t('visualizations.mfa.weak')}
                                </span>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>

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

export default MfaFactorsViz;
