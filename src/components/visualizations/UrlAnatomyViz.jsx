import React from 'react';
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.span
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import VizContainer from './VizContainer';
import AnimationControls from './AnimationControls';
import StepCaption from './StepCaption';
import { useAnimationControl } from './useAnimationControl';
import { tArray } from '../../i18n/safeTranslate';

// The URL is modeled as adjacent segments so each part can be
// highlighted independently while still reading as one continuous string.
const legitUrlParts = [
    { text: 'https://', part: 'scheme' },
    { text: 'shop.', part: 'subdomain' },
    { text: 'example.com', part: 'domain' },
    { text: '/deals/summer?item=42', part: 'path' },
];

const scamUrlParts = [
    { text: 'https://', part: 'scheme' },
    { text: 'paypal.com.', part: 'subdomain' },
    { text: 'secure-check.ru', part: 'domain' },
    { text: '/login', part: 'path' },
];

const partColors = {
    scheme: 'var(--primary)',
    subdomain: '#ffa94d',
    domain: '#00ff9d',
    path: 'var(--accent)',
};

const legendParts = [
    { part: 'scheme', labelKey: 'scheme_label' },
    { part: 'subdomain', labelKey: 'subdomain_label' },
    { part: 'domain', labelKey: 'domain_label' },
    { part: 'path', labelKey: 'path_label' },
];

const UrlAnatomyViz = () => {
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
        interval: 5000
    });

    const isScamStep = currentStep === 4;
    const segments = isScamStep ? scamUrlParts : legitUrlParts;

    // Which part is the "hero" highlight for the current step (null = no emphasis, step 0)
    const heroPart = currentStep === 1 ? 'scheme'
        : currentStep === 2 ? 'domain'
        : currentStep === 3 ? 'path'
        : currentStep === 4 ? 'domain'
        : null;

    const transition = { duration: prefersReducedMotion ? 0 : 0.4 };

    // Per-segment visual treatment. The scam step reuses the same "part"
    // vocabulary but flips the meaning: the flagged subdomain gets a
    // warning treatment instead of the neutral emphasis used on step 2.
    const getSegmentStyle = (part) => {
        const isHero = part === heroPart;
        const isSubdomainEmphasis = currentStep === 2 && part === 'subdomain';
        const isSubdomainWarning = isScamStep && part === 'subdomain';

        if (isHero) {
            const color = isScamStep ? '#ff4d6d' : partColors[part];
            return {
                opacity: 1,
                color,
                textShadow: `0 0 10px ${color}`,
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                borderBottom: 'none',
            };
        }
        if (isSubdomainEmphasis) {
            return {
                opacity: 0.85,
                color: partColors.subdomain,
                textShadow: 'none',
                textDecoration: 'none',
                borderBottom: 'none',
            };
        }
        if (isSubdomainWarning) {
            return {
                opacity: 0.75,
                color: 'var(--text-muted)',
                textShadow: 'none',
                textDecoration: 'none',
                borderBottom: '2px dashed #ffa94d',
            };
        }
        if (heroPart) {
            return {
                opacity: 0.45,
                color: 'var(--text-main)',
                textShadow: 'none',
                textDecoration: 'none',
                borderBottom: 'none',
            };
        }
        return {
            opacity: 1,
            color: 'var(--text-main)',
            textShadow: 'none',
            textDecoration: 'none',
            borderBottom: 'none',
        };
    };

    // The legend row doubles as the step-2 "pointer" labels (domain + subdomain)
    // called for in the spec: both light up together when reading the owner.
    const isLegendActive = (part) => {
        if (part === heroPart) return true;
        if (part === 'subdomain' && (currentStep === 2 || currentStep === 4)) return true;
        return false;
    };

    const legendColor = (part) => (part === 'domain' && isScamStep ? '#ff4d6d' : partColors[part]);

    return (
        <VizContainer
            title={t('visualizations.url.title')}
            whyItMatters={t('visualizations.url.why_matters')}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Legit vs. scam pill */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span className={`pill ${isScamStep ? 'pill-accent' : 'pill-success'}`}>
                        {isScamStep ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                        {isScamStep ? t('visualizations.url.scam_label') : t('visualizations.url.legit_label')}
                    </span>
                </div>

                {/* URL bar */}
                <div
                    style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        padding: '1rem 1.25rem',
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                    }}
                >
                    {segments.map((segment, index) => (
                        <motion.span
                            key={index}
                            animate={getSegmentStyle(segment.part)}
                            transition={transition}
                        >
                            {segment.text}
                        </motion.span>
                    ))}
                </div>

                {/* Legend: also serves as the step-2 pointer labels for domain/subdomain */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                    {legendParts.map(({ part, labelKey }) => (
                        <span
                            key={part}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                border: `1px solid ${legendColor(part)}`,
                                color: legendColor(part),
                                opacity: isLegendActive(part) ? 1 : 0.4,
                                transition: prefersReducedMotion ? 'none' : 'opacity 0.3s ease',
                            }}
                        >
                            {t(`visualizations.url.${labelKey}`)}
                        </span>
                    ))}
                </div>

                {/* Step narration */}
                <StepCaption steps={tArray(t, 'visualizations.url.steps')} currentStep={currentStep} />

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

export default UrlAnatomyViz;
