import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Mail, Paperclip, ExternalLink } from 'lucide-react';
import VizContainer from './VizContainer';
import AnimationControls from './AnimationControls';
import StepCaption from './StepCaption';
import { useAnimationControl } from './useAnimationControl';
import { tArray } from '../../i18n/safeTranslate';

const redFlags = [
    { id: 'sender', position: 'sender' },
    { id: 'urgency', position: 'subject' },
    { id: 'greeting', position: 'greeting' },
    { id: 'link', position: 'link' },
    { id: 'attachment', position: 'attachment' },
];

const PhishingEmailViz = () => {
    const { t } = useTranslation();
    const [mode, setMode] = useState('tour');
    const [showingUrl, setShowingUrl] = useState(false);
    const [foundFlags, setFoundFlags] = useState(() => new Set());
    const [lastFound, setLastFound] = useState(null);

    const {
        currentStep,
        isPlaying,
        totalSteps,
        nextStep,
        prevStep,
        goToStep,
        togglePlay,
        pause,
        prefersReducedMotion
    } = useAnimationControl({
        totalSteps: 5,
        interval: 2500,
        loop: true,
        autoPlay: false
    });

    const isFindMode = mode === 'find';
    const steps = tArray(t, 'visualizations.phishing.steps');
    const allFound = foundFlags.size === redFlags.length;

    // Handle URL reveal for link step (step 3) in tour mode
    useEffect(() => {
        if (isFindMode || currentStep !== 3) return undefined;

        const timer = setTimeout(() => setShowingUrl(true), 500);
        return () => {
            clearTimeout(timer);
            setShowingUrl(false);
        };
    }, [currentStep, isFindMode]);

    const switchMode = (nextMode) => {
        if (nextMode === mode) return;
        setMode(nextMode);
        setFoundFlags(new Set());
        setLastFound(null);
        if (nextMode === 'find') pause();
    };

    const markFound = (index) => {
        setFoundFlags((prev) => {
            if (prev.has(index)) return prev;
            const next = new Set(prev);
            next.add(index);
            return next;
        });
        setLastFound(index);
    };

    const isHighlighted = (position) => {
        return !isFindMode && redFlags[currentStep]?.position === position;
    };

    // In find mode the link's real URL is revealed once that flag is found
    const urlRevealed = isFindMode ? foundFlags.has(3) : showingUrl;

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

    // Tour mode: animated highlight region. Find mode: real <button> hotspot.
    const FieldRegion = isFindMode ? 'button' : motion.div;
    const GreetingRegion = isFindMode ? 'button' : motion.p;
    const LinkTag = isFindMode ? 'span' : 'a';
    // <button> only allows phrasing content, so the reveal becomes a span there
    const UrlRevealTag = isFindMode ? motion.span : motion.div;

    const tourProps = (position, style) => ({
        style,
        variants: highlightVariants,
        animate: isHighlighted(position) ? 'active' : 'inactive',
    });

    const hotspotProps = (index, style = {}, keepBackground = false) => {
        const isFound = foundFlags.has(index);
        return {
            type: 'button',
            style: {
                fontFamily: 'inherit',
                textAlign: 'left',
                // Clear the native button background unless a class supplies one;
                // when found, let .phishing-hotspot.found paint it instead
                ...(isFound || keepBackground ? {} : { background: 'transparent' }),
                ...style,
            },
            'aria-label': t(`visualizations.phishing.flags.${redFlags[index].id}`),
            'aria-pressed': isFound,
            onClick: () => markFound(index),
        };
    };

    const regionClass = (baseClass, index) => {
        if (!isFindMode) return baseClass;
        return `${baseClass} phishing-hotspot${foundFlags.has(index) ? ' found' : ''}`;
    };

    const greetingStyle = { display: 'inline-block', padding: '2px 6px', borderRadius: '4px', border: '1px solid transparent' };

    return (
        <VizContainer
            title={t('visualizations.phishing.email_title')}
            whyItMatters={t('visualizations.phishing.why_matters')}
        >
            <div className="phishing-viz-wrapper">
                {/* Mode toggle */}
                <div className="viz-mode-toggle">
                    <button
                        type="button"
                        className={isFindMode ? '' : 'active'}
                        aria-pressed={!isFindMode}
                        onClick={() => switchMode('tour')}
                    >
                        {t('visualizations.phishing.find.watch_tour')}
                    </button>
                    <button
                        type="button"
                        className={isFindMode ? 'active' : ''}
                        aria-pressed={isFindMode}
                        onClick={() => switchMode('find')}
                    >
                        {t('visualizations.phishing.find.try_it')}
                    </button>
                </div>

                {/* Email mockup */}
                <div className="phishing-email">
                    {/* Email header */}
                    <div className="phishing-email-header">
                        <Mail size={16} color="var(--text-dim)" />
                        <span>{t('visualizations.phishing.email_title')}</span>
                    </div>

                    {/* From field */}
                    <FieldRegion
                        className={regionClass('phishing-field', 0)}
                        {...(isFindMode ? hotspotProps(0, { width: '100%' }) : tourProps('sender'))}
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
                    </FieldRegion>

                    {/* Subject field */}
                    <FieldRegion
                        className={regionClass('phishing-field', 1)}
                        {...(isFindMode ? hotspotProps(1, { width: '100%' }) : tourProps('subject'))}
                    >
                        <span className="phishing-field-label">{t('visualizations.phishing.subject')}:</span>
                        <span className="phishing-field-value phishing-urgent">
                            {t('visualizations.phishing.subject_prefix')} {t('visualizations.phishing.subject_text')}
                        </span>
                        <AnimatePresence>
                            {isHighlighted('subject') && (
                                <motion.div className="phishing-flag" variants={flagVariants} initial="hidden" animate="visible" exit="hidden">
                                    <AlertTriangle size={12} />
                                    <span>{t('visualizations.phishing.flags.urgency')}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </FieldRegion>

                    {/* Email body */}
                    <div className="phishing-body">
                        {/* Greeting */}
                        <GreetingRegion
                            className={regionClass('phishing-greeting', 2)}
                            {...(isFindMode
                                ? hotspotProps(2, { ...greetingStyle, fontSize: 'inherit' })
                                : tourProps('greeting', greetingStyle))}
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
                        </GreetingRegion>

                        <p className="phishing-text">{t('visualizations.phishing.body_text')}</p>

                        {/* Fake link */}
                        <FieldRegion
                            className={regionClass('phishing-link-wrapper', 3)}
                            {...(isFindMode ? hotspotProps(3) : tourProps('link'))}
                        >
                            <LinkTag
                                className="phishing-link"
                                {...(isFindMode ? {} : { href: '#', onClick: (e) => e.preventDefault() })}
                            >
                                <ExternalLink size={14} />
                                {t('visualizations.phishing.link_text')}
                            </LinkTag>
                            <AnimatePresence>
                                {urlRevealed && (
                                    <UrlRevealTag
                                        className="phishing-url-reveal"
                                        variants={urlRevealVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    >
                                        <span className="phishing-url-label">{t('visualizations.phishing.actual_url')}:</span>
                                        <span className="phishing-url-fake">https://paypa1-secure-login.scam.ru/...</span>
                                    </UrlRevealTag>
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
                        </FieldRegion>

                        {/* Attachment */}
                        <FieldRegion
                            className={regionClass('phishing-attachment', 4)}
                            {...(isFindMode ? hotspotProps(4, {}, true) : tourProps('attachment'))}
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
                        </FieldRegion>
                    </div>
                </div>

                {/* Caption slot: tour narration, or find-mode hint / revealed flag */}
                {isFindMode ? (
                    <div className="viz-step-caption" aria-live="polite" aria-atomic="true">
                        {lastFound === null ? (
                            <p className="viz-step-caption-text">{t('visualizations.phishing.find.hint')}</p>
                        ) : (
                            <>
                                <h5 className="viz-step-caption-title">{steps[lastFound]?.title}</h5>
                                <p className="viz-step-caption-text">{steps[lastFound]?.text}</p>
                            </>
                        )}
                        <div style={{ marginTop: '0.6rem' }}>
                            {allFound ? (
                                <span className="pill pill-success">{t('visualizations.phishing.find.found_all')}</span>
                            ) : (
                                <span className="viz-step-caption-number">
                                    {t('visualizations.phishing.find.found_count', { found: foundFlags.size, total: redFlags.length })}
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <StepCaption steps={steps} currentStep={currentStep} />
                )}

                {/* Red flags legend (tour mode only — find mode would spoil the hunt) */}
                {!isFindMode && (
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
                )}

                {!isFindMode && (
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
                )}
            </div>
        </VizContainer>
    );
};

export default PhishingEmailViz;
