import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Radio, Network, Globe, Truck, Link2, Lock, AppWindow, ArrowDown, ArrowUp } from 'lucide-react';
import VizContainer from './VizContainer';
import AnimationControls from './AnimationControls';
import { useAnimationControl } from './useAnimationControl';

const OsiModelViz = () => {
    const { t } = useTranslation();
    const [direction, setDirection] = useState('down'); // 'down' = sending, 'up' = receiving

    const layers = [
        { num: 7, key: 'application', icon: AppWindow, color: '#00f2ff' },
        { num: 6, key: 'presentation', icon: Lock, color: '#00d4ff' },
        { num: 5, key: 'session', icon: Link2, color: '#00b8ff' },
        { num: 4, key: 'transport', icon: Truck, color: '#7000ff' },
        { num: 3, key: 'network', icon: Globe, color: '#9933ff' },
        { num: 2, key: 'datalink', icon: Network, color: '#ff0055' },
        { num: 1, key: 'physical', icon: Radio, color: '#ff3366' },
    ];

    // Custom step handler to implement direction switching
    const handleStepChange = useCallback((newStep, prevStep) => {
        // When reaching the end going down, switch to up
        if (direction === 'down' && newStep === 6 && prevStep === 5) {
            setDirection('up');
        }
        // When reaching the beginning going up, switch to down
        else if (direction === 'up' && newStep === 0 && prevStep === 1) {
            setDirection('down');
        }
    }, [direction]);

    const {
        currentStep,
        isPlaying,
        totalSteps,
        nextStep: baseNextStep,
        prevStep: basePrevStep,
        goToStep,
        togglePlay,
        prefersReducedMotion
    } = useAnimationControl({
        totalSteps: 7,
        interval: 800,
        loop: true
    });

    // Enhanced next/prev that handle direction
    const nextStep = () => {
        if (direction === 'down') {
            if (currentStep >= 6) {
                setDirection('up');
            }
            baseNextStep();
        } else {
            if (currentStep <= 0) {
                setDirection('down');
            }
            basePrevStep();
        }
    };

    const prevStep = () => {
        if (direction === 'down') {
            if (currentStep <= 0) {
                setDirection('up');
            }
            basePrevStep();
        } else {
            if (currentStep >= 6) {
                setDirection('down');
            }
            baseNextStep();
        }
    };

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

    // Map currentStep to layer index (when direction is down, step 0 = layer 0; when up, step 0 = layer 6)
    const activeLayer = direction === 'down' ? currentStep : (6 - currentStep);

    return (
        <VizContainer title={t('visualizations.osi.title')}>
            <div className="osi-viz-wrapper">
                {/* Direction indicator */}
                <div className="osi-direction">
                    <motion.div
                        className="osi-direction-icon"
                        animate={{ y: direction === 'down' ? [0, 5, 0] : [0, -5, 0] }}
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
                            {activeLayer === index && !prefersReducedMotion && (
                                <motion.div
                                    className="osi-data-packet"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ background: layer.color }}
                                >
                                    {t('visualizations.osi.data')}
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>

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

export default OsiModelViz;
