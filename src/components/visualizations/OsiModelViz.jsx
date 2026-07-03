import React from 'react';
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.div
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Radio, Network, Globe, Truck, Link2, Lock, AppWindow, ArrowDown, ArrowUp } from 'lucide-react';
import VizContainer from './VizContainer';
import AnimationControls from './AnimationControls';
import StepCaption from './StepCaption';
import { useAnimationControl } from './useAnimationControl';
import { tArray } from '../../i18n/safeTranslate';

const OsiModelViz = () => {
    const { t } = useTranslation();

    // Visual order: index 0 = Application (top) ... index 6 = Physical (bottom)
    const layers = [
        { num: 7, key: 'application', icon: AppWindow, color: '#00f2ff' },
        { num: 6, key: 'presentation', icon: Lock, color: '#00d4ff' },
        { num: 5, key: 'session', icon: Link2, color: '#00b8ff' },
        { num: 4, key: 'transport', icon: Truck, color: '#7000ff' },
        { num: 3, key: 'network', icon: Globe, color: '#9933ff' },
        { num: 2, key: 'datalink', icon: Network, color: '#ff0055' },
        { num: 1, key: 'physical', icon: Radio, color: '#ff3366' },
    ];

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
        totalSteps: 14,
        interval: 2600,
        loop: true
    });

    // Narration: steps_down = Application -> Physical, steps_up = Physical -> Application.
    // This matches the step->layer mapping below, so captions[currentStep] indexes directly.
    const captions = [
        ...tArray(t, 'visualizations.osi.steps_down'),
        ...tArray(t, 'visualizations.osi.steps_up')
    ];

    const layerVariants = {
        inactive: {
            scale: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        active: {
            scale: 1.02,
            transition: { type: 'spring', stiffness: 300, damping: 25 }
        }
    };

    // Steps 0-6 travel down the stack (Application -> Physical),
    // steps 7-13 travel back up (Physical -> Application).
    const direction = currentStep <= 6 ? 'down' : 'up';
    const activeLayer = direction === 'down' ? currentStep : (13 - currentStep);

    // Nesting-envelopes metaphor: each layer below Application adds one colored
    // ring around the message on the way down; the rings are shed one per layer
    // on the way up. At the active layer, rings = layers 1..activeLayer
    // (innermost ring first), so Physical shows max wrapping and Application
    // shows the bare message.
    const wrappedLayers = layers.slice(1, activeLayer + 1);
    const envelopeRings = wrappedLayers.length > 0
        ? wrappedLayers.map((layer, i) => `0 0 0 ${(i + 1) * 2}px ${layer.color}`).join(', ')
        : 'none';

    return (
        <VizContainer
            title={t('visualizations.osi.title')}
            whyItMatters={t('visualizations.osi.why_matters')}
        >
            <div className="osi-viz-wrapper">
                {/* Per-step narration */}
                <StepCaption steps={captions} currentStep={currentStep} />

                {/* Direction indicator */}
                <div className="osi-direction">
                    <motion.div
                        className="osi-direction-icon"
                        animate={prefersReducedMotion
                            ? { y: 0 }
                            : { y: direction === 'down' ? [0, 5, 0] : [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
                    >
                        {direction === 'down' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                    </motion.div>
                    <span>{direction === 'down' ? t('visualizations.osi.sending') : t('visualizations.osi.receiving')}</span>
                </div>

                {/* OSI Layers Stack */}
                <div className="osi-stack">
                    {layers.map((layer, index) => (
                        <motion.div
                            key={layer.key}
                            className={`osi-layer ${activeLayer === index ? 'active' : ''}`}
                            variants={layerVariants}
                            animate={activeLayer === index ? 'active' : 'inactive'}
                            style={{
                                '--layer-color': layer.color,
                                borderColor: activeLayer === index ? layer.color : undefined,
                                boxShadow: activeLayer === index ? `0 0 20px ${layer.color}40` : undefined
                            }}
                        >
                            <div className="osi-layer-num" style={{ background: layer.color }}>
                                {layer.num}
                            </div>
                            <div className="osi-layer-icon">
                                <layer.icon size={18} color={layer.color} />
                            </div>
                            <div className="osi-layer-info">
                                <span className="osi-layer-name">{t(`visualizations.osi.layers.${layer.key}.name`)}</span>
                                <span className="osi-layer-example">{t(`visualizations.osi.layers.${layer.key}.example`)}</span>
                            </div>
                            {activeLayer === index && (
                                <motion.div
                                    className="osi-data-packet"
                                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{
                                        marginLeft: 'auto',
                                        marginRight: '0.25rem',
                                        flexShrink: 0,
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.65rem',
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        background: 'var(--bg-dark)',
                                        color: layers[0].color,
                                        border: `1px solid ${layers[0].color}`,
                                        boxShadow: envelopeRings
                                    }}
                                >
                                    {t('visualizations.osi.data')}
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Animation Controls: 7 dots (one per layer), 14 steps for prev/next */}
                <AnimationControls
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    isPlaying={isPlaying}
                    onPrev={prevStep}
                    onNext={nextStep}
                    onGoToStep={goToStep}
                    onTogglePlay={togglePlay}
                    dotCount={7}
                    activeDot={activeLayer}
                    onDotClick={(i) => goToStep(i)}
                    disabled={prefersReducedMotion}
                />
            </div>
        </VizContainer>
    );
};

export default OsiModelViz;
