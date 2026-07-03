import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.div
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Check, Infinity as InfinityIcon } from 'lucide-react';
import VizContainer from './VizContainer';
import AnimationControls from './AnimationControls';
import StepCaption from './StepCaption';
import { useAnimationControl } from './useAnimationControl';
import { tArray } from '../../i18n/safeTranslate';

const IpVersionsViz = () => {
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
        interval: 5000
    });

    const v4Example = t('visualizations.ipv.v4_example');
    const v6Example = t('visualizations.ipv.v6_example');

    // Steps: 0 = a device gets an address (IPv4 address focused),
    // 1 = IPv4 card emphasized, 2 = depletion warning, 3 = IPv6 emphasized
    const addressFocused = currentStep === 0;
    const v4Emphasized = currentStep === 1 || currentStep === 2;
    const warningEmphasized = currentStep === 2;
    const v6Emphasized = currentStep === 3;
    const v4Level = currentStep >= 2 ? 95 : 70;

    // Typewriter: v4 types on step 0, v6 types on step 3 (skipped for reduced motion)
    const typingTarget = currentStep === 0 ? v4Example : currentStep === 3 ? v6Example : null;
    const [typingProgress, setTypingProgress] = useState({ target: null, value: '' });

    useEffect(() => {
        if (prefersReducedMotion || !typingTarget) {
            return undefined;
        }
        let index = 0;
        const id = setInterval(() => {
            index += 1;
            setTypingProgress({ target: typingTarget, value: typingTarget.slice(0, index) });
            if (index >= typingTarget.length) {
                clearInterval(id);
            }
        }, 90);
        return () => clearInterval(id);
    }, [typingTarget, prefersReducedMotion]);

    const typed = typingProgress.target === typingTarget ? typingProgress.value : '';
    const isTypingV4 = !prefersReducedMotion && currentStep === 0;
    const isTypingV6 = !prefersReducedMotion && currentStep === 3;
    const v4Address = isTypingV4 ? typed : v4Example;
    const v6Address = isTypingV6 ? typed : v6Example;

    const cursor = (
        <motion.span
            className="ipv-cursor"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
        >|</motion.span>
    );

    return (
        <VizContainer
            title={t('visualizations.ipv.title')}
            whyItMatters={t('visualizations.ipv.why_matters')}
        >
            <div className="ipv-viz-wrapper">
                <div className="ipv-comparison">
                    {/* IPv4 */}
                    <motion.div
                        className="ipv-version v4"
                        initial={false}
                        animate={{
                            opacity: v6Emphasized ? 0.6 : 1,
                            scale: v4Emphasized ? 1.02 : 1,
                            boxShadow: v4Emphasized
                                ? '0 0 18px rgba(255, 0, 85, 0.3)'
                                : '0 0 0px rgba(255, 0, 85, 0)'
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="ipv-header">
                            <AlertTriangle size={18} color="var(--accent)" />
                            <span className="ipv-label">{t('visualizations.ipv.v4_label')}</span>
                        </div>

                        <motion.div
                            className="ipv-address"
                            initial={false}
                            animate={{
                                boxShadow: addressFocused
                                    ? '0 0 14px rgba(0, 242, 255, 0.5)'
                                    : '0 0 0px rgba(0, 242, 255, 0)'
                            }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="ipv-address-text">{v4Address || ' '}</span>
                            {isTypingV4 && cursor}
                        </motion.div>

                        <div className="ipv-pool">
                            <div className="ipv-pool-label">{t('visualizations.ipv.v4_count')}</div>
                            <div className="ipv-pool-bar">
                                <motion.div
                                    className="ipv-pool-fill depleted"
                                    initial={false}
                                    animate={{ width: `${v4Level}%` }}
                                    transition={{ duration: prefersReducedMotion ? 0 : 1.2, ease: 'easeOut' }}
                                />
                            </div>
                            <motion.div
                                className="ipv-pool-status depleted"
                                initial={false}
                                animate={{
                                    scale: warningEmphasized ? 1.1 : 1,
                                    opacity: warningEmphasized ? 1 : 0.8
                                }}
                                transition={{ duration: 0.4 }}
                                style={{ transformOrigin: 'left center' }}
                            >
                                <AlertTriangle size={12} />
                                <span>{t('visualizations.ipv.exhausted')}</span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* VS Divider */}
                    <div className="ipv-divider">
                        <span>{t('visualizations.ipv.vs')}</span>
                    </div>

                    {/* IPv6 */}
                    <motion.div
                        className="ipv-version v6"
                        initial={false}
                        animate={{
                            opacity: v4Emphasized || warningEmphasized ? 0.6 : 1,
                            scale: v6Emphasized ? 1.02 : 1,
                            boxShadow: v6Emphasized
                                ? '0 0 18px rgba(0, 255, 157, 0.3)'
                                : '0 0 0px rgba(0, 255, 157, 0)'
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="ipv-header">
                            <Check size={18} color="#00ff9d" />
                            <span className="ipv-label">{t('visualizations.ipv.v6_label')}</span>
                        </div>

                        <div className="ipv-address">
                            <span className="ipv-address-text v6">{v6Address || ' '}</span>
                            {isTypingV6 && cursor}
                        </div>

                        <div className="ipv-pool">
                            <div className="ipv-pool-label">{t('visualizations.ipv.v6_count')}</div>
                            <div className="ipv-pool-bar">
                                <div className="ipv-pool-fill unlimited" style={{ width: '100%' }} />
                                <div className="ipv-pool-infinite">
                                    <InfinityIcon size={16} color="#00ff9d" />
                                </div>
                            </div>
                            <div className="ipv-pool-status unlimited">
                                <Check size={12} />
                                <span>{t('visualizations.ipv.unlimited')}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Step narration */}
                <StepCaption
                    steps={tArray(t, 'visualizations.ipv.steps')}
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

export default IpVersionsViz;
