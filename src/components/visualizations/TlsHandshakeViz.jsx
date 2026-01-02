import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Monitor, Server, ArrowRight, ArrowLeft, Lock, Key, ShieldCheck } from 'lucide-react';
import VizContainer from './VizContainer';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const TlsHandshakeViz = () => {
    const { t } = useTranslation();
    const prefersReducedMotion = usePrefersReducedMotion();
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { id: 'step1', direction: 'right', icon: ArrowRight, color: 'var(--primary)' },
        { id: 'step2', direction: 'left', icon: ArrowLeft, color: 'var(--secondary)' },
        { id: 'step3', direction: 'right', icon: Key, color: '#ffa94d' },
        { id: 'step4', direction: 'both', icon: Lock, color: '#00ff9d' },
    ];

    // Auto-cycle through steps
    useEffect(() => {
        if (prefersReducedMotion) {
            setCurrentStep(3);
            return;
        }

        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % 5);
        }, 1500);

        return () => clearInterval(interval);
    }, [prefersReducedMotion]);

    const messageVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 25 }
        },
        exit: { opacity: 0, scale: 0.5 }
    };

    const getMessagePosition = (step, direction) => {
        if (direction === 'right') return { left: '50%', transform: 'translateX(-50%)' };
        if (direction === 'left') return { left: '50%', transform: 'translateX(-50%)' };
        return { left: '50%', transform: 'translateX(-50%)' };
    };

    return (
        <VizContainer title={t('visualizations.tls.title')}>
            <div className="tls-viz-wrapper">
                {/* Endpoints */}
                <div className="tls-endpoints">
                    {/* Browser */}
                    <motion.div
                        className="tls-endpoint browser"
                        animate={{
                            borderColor: currentStep === 3 ? '#00ff9d' : 'rgba(255, 255, 255, 0.1)',
                            boxShadow: currentStep === 3 ? '0 0 20px rgba(0, 255, 157, 0.3)' : 'none'
                        }}
                    >
                        <Monitor size={28} color="var(--primary)" />
                        <span>{t('visualizations.tls.browser')}</span>
                    </motion.div>

                    {/* Connection area */}
                    <div className="tls-connection">
                        <div className="tls-connection-line" />

                        {/* Animated messages */}
                        <AnimatePresence>
                            {currentStep < 4 && steps[currentStep] && (
                                <motion.div
                                    key={currentStep}
                                    className={`tls-message ${steps[currentStep].direction}`}
                                    variants={messageVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    style={{
                                        backgroundColor: `${steps[currentStep].color}20`,
                                        borderColor: steps[currentStep].color
                                    }}
                                >
                                    {React.createElement(steps[currentStep].icon, {
                                        size: 14,
                                        color: steps[currentStep].color
                                    })}
                                    <span style={{ color: steps[currentStep].color }}>
                                        {t(`visualizations.tls.step${currentStep + 1}`)}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Secure tunnel indicator */}
                        <AnimatePresence>
                            {currentStep === 4 && (
                                <motion.div
                                    className="tls-secure-tunnel"
                                    initial={{ opacity: 0, scaleX: 0 }}
                                    animate={{ opacity: 1, scaleX: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <ShieldCheck size={20} color="#00ff9d" />
                                    <span>{t('visualizations.tls.secure')}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Server */}
                    <motion.div
                        className="tls-endpoint server"
                        animate={{
                            borderColor: currentStep === 3 ? '#00ff9d' : 'rgba(255, 255, 255, 0.1)',
                            boxShadow: currentStep === 3 ? '0 0 20px rgba(0, 255, 157, 0.3)' : 'none'
                        }}
                    >
                        <Server size={28} color="var(--secondary)" />
                        <span>{t('visualizations.tls.server')}</span>
                    </motion.div>
                </div>

                {/* Step indicators */}
                <div className="tls-steps">
                    {steps.map((step, i) => (
                        <div
                            key={step.id}
                            className={`tls-step ${currentStep === i ? 'active' : ''} ${currentStep > i ? 'done' : ''}`}
                        >
                            <span className="tls-step-num">{i + 1}</span>
                            <span className="tls-step-label">{t(`visualizations.tls.step${i + 1}`)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </VizContainer>
    );
};

export default TlsHandshakeViz;
