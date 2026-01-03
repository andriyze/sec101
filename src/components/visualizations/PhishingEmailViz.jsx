import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Mail, Paperclip, ExternalLink } from 'lucide-react';
import VizContainer from './VizContainer';
import AnimationControls from './AnimationControls';
import { useAnimationControl } from './useAnimationControl';

const PhishingEmailViz = () => {
    const { t } = useTranslation();
    const [showingUrl, setShowingUrl] = useState(false);

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
        interval: 2500,
        loop: true,
        autoPlay: false
    });

    const redFlags = [
        { id: 'sender', position: 'sender' },
        { id: 'urgency', position: 'subject' },
        { id: 'greeting', position: 'greeting' },
        { id: 'link', position: 'link' },
        { id: 'attachment', position: 'attachment' },
    ];

    // Handle URL reveal for link step (step 3)
    useEffect(() => {
        if (currentStep === 3) {
            const timer = setTimeout(() => setShowingUrl(true), 500);
            return () => clearTimeout(timer);
        } else {
            setShowingUrl(false);
        }
    }, [currentStep]);

    const isHighlighted = (position) => {
        return redFlags[currentStep]?.position === position;
    };

    const highlightVariants = {
        inactive: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
        },
        active: {
            backgroundColor: 'rgba(255, 0, 85, 0.1)',
            borderColor: 'var(--accent)',
            transition: { duration: 0.3 },
        },
    };

    const flagVariants = {
        hidden: { opacity: 0, scale: 0.8, x: 10 },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 300, damping: 25 },
        },
    };

    const urlRevealVariants = {
        hidden: { opacity: 0, y: -5 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <VizContainer>
            <div className="phishing-viz-wrapper">
                {/* Email mockup */}
                <div className="phishing-email">
                    {/* Email header */}
                    <div className="phishing-email-header">
                        <Mail size={16} color="var(--text-dim)" />
                        <span>{t('visualizations.phishing.email_title')}</span>
                    </div>

                    {/* From field */}
                    <motion.div
                        className="phishing-field"
                        variants={highlightVariants}
                        animate={isHighlighted('sender') ? 'active' : 'inactive'}
                    >
                        <span className="phishing-field-label">{t('visualizations.phishing.from')}:</span>
                        <span className="phishing-field-value">
                            "PayPal Support" &lt;<span className="phishing-fake">security@paypa1-billing.com</span>&gt;
                        </span>
                        <AnimatePresence>
                            {isHighlighted('sender') && (
                                <motion.div className="phishing-flag" variants={flagVariants} initial="hidden" animate="visible" exit="hidden">
                                    <AlertTriangle size={12} />
                                    <span>{t('visualizations.phishing.flags.sender')}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Subject field */}
                    <motion.div
                        className="phishing-field"
                        variants={highlightVariants}
                        animate={isHighlighted('subject') ? 'active' : 'inactive'}
                    >
                        <span className="phishing-field-label">{t('visualizations.phishing.subject')}:</span>
                        <span className="phishing-field-value phishing-urgent">
                            ⚠️ URGENT: {t('visualizations.phishing.subject_text')}
                        </span>
                        <AnimatePresence>
                            {isHighlighted('subject') && (
                                <motion.div className="phishing-flag" variants={flagVariants} initial="hidden" animate="visible" exit="hidden">
                                    <AlertTriangle size={12} />
                                    <span>{t('visualizations.phishing.flags.urgency')}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Email body */}
                    <div className="phishing-body">
                        {/* Greeting */}
                        <motion.p
                            className="phishing-greeting"
                            variants={highlightVariants}
                            animate={isHighlighted('greeting') ? 'active' : 'inactive'}
                            style={{ display: 'inline-block', padding: '2px 6px', borderRadius: '4px', border: '1px solid transparent' }}
                        >
                            {t('visualizations.phishing.greeting')}
                            <AnimatePresence>
                                {isHighlighted('greeting') && (
                                    <motion.span className="phishing-flag inline" variants={flagVariants} initial="hidden" animate="visible" exit="hidden">
                                        <AlertTriangle size={12} />
                                        <span>{t('visualizations.phishing.flags.greeting')}</span>
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.p>

                        <p className="phishing-text">{t('visualizations.phishing.body_text')}</p>

                        {/* Fake link */}
                        <motion.div
                            className="phishing-link-wrapper"
                            variants={highlightVariants}
                            animate={isHighlighted('link') ? 'active' : 'inactive'}
                        >
                            <a className="phishing-link" href="#" onClick={(e) => e.preventDefault()}>
                                <ExternalLink size={14} />
                                {t('visualizations.phishing.link_text')}
                            </a>
                            <AnimatePresence>
                                {showingUrl && (
                                    <motion.div
                                        className="phishing-url-reveal"
                                        variants={urlRevealVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    >
                                        <span className="phishing-url-label">{t('visualizations.phishing.actual_url')}:</span>
                                        <span className="phishing-url-fake">https://paypa1-secure-login.scam.ru/...</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <AnimatePresence>
                                {isHighlighted('link') && (
                                    <motion.div className="phishing-flag" variants={flagVariants} initial="hidden" animate="visible" exit="hidden">
                                        <AlertTriangle size={12} />
                                        <span>{t('visualizations.phishing.flags.link')}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Attachment */}
                        <motion.div
                            className="phishing-attachment"
                            variants={highlightVariants}
                            animate={isHighlighted('attachment') ? 'active' : 'inactive'}
                        >
                            <Paperclip size={14} />
                            <span>invoice_2024.pdf.exe</span>
                            <AnimatePresence>
                                {isHighlighted('attachment') && (
                                    <motion.div className="phishing-flag" variants={flagVariants} initial="hidden" animate="visible" exit="hidden">
                                        <AlertTriangle size={12} />
                                        <span>{t('visualizations.phishing.flags.attachment')}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>

                {/* Red flags legend */}
                <div className="phishing-legend">
                    <div className="phishing-legend-title">
                        <AlertTriangle size={14} color="var(--accent)" />
                        <span>{t('visualizations.phishing.red_flags')}</span>
                    </div>
                    <div className="phishing-legend-items">
                        {redFlags.map((flag, index) => (
                            <motion.div
                                key={flag.id}
                                className={`phishing-legend-item ${currentStep === index ? 'active' : ''}`}
                                animate={{
                                    opacity: currentStep === index ? 1 : 0.4,
                                    scale: currentStep === index ? 1.05 : 1,
                                }}
                            >
                                <span className="phishing-legend-number">{index + 1}</span>
                                <span>{t(`visualizations.phishing.legend.${flag.id}`)}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

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

export default PhishingEmailViz;
