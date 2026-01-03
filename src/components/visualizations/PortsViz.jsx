import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Building2, Mail, Globe, Terminal, Lock, Server } from 'lucide-react';
import VizContainer from './VizContainer';
import AnimationControls from './AnimationControls';
import { useAnimationControl } from './useAnimationControl';

const PortsViz = () => {
    const { t } = useTranslation();

    const ports = [
        { num: '80', icon: Globe, color: '#ff6b6b' },
        { num: '443', icon: Lock, color: '#00ff9d' },
        { num: '22', icon: Terminal, color: '#00f2ff' },
        { num: '25', icon: Mail, color: '#ffa94d' },
        { num: '53', icon: Server, color: '#7000ff' },
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
        totalSteps: ports.length,
        interval: 2500,
        loop: true
    });

    const activePort = currentStep;

    const visitorVariants = {
        initial: {
            x: -100,
            opacity: 0
        },
        animate: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        },
        exit: {
            opacity: 0,
            scale: 0.5
        }
    };

    return (
        <VizContainer title={t('visualizations.ports.title')}>
            <div className="ports-viz-wrapper">
                {/* Building header */}
                <div className="ports-building-header">
                    <Building2 size={20} color="var(--primary)" />
                    <span className="ports-building-name">{t('visualizations.ports.building')}</span>
                    <span className="ports-ip">{t('visualizations.ports.ip_address')}</span>
                </div>

                {/* Visitor indicator */}
                <AnimatePresence mode="wait">
                    {!prefersReducedMotion && (
                        <motion.div
                            key={activePort}
                            className="ports-visitor"
                            variants={visitorVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <span>{t('visualizations.ports.visitor')}</span>
                            <span className="ports-visitor-dest">→ :{ports[activePort]?.num}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Building with apartments (ports) */}
                <div className="ports-building">
                    {ports.map((port, index) => (
                        <motion.div
                            key={port.num}
                            className={`ports-apartment ${activePort === index ? 'active' : ''}`}
                            animate={{
                                borderColor: activePort === index ? port.color : 'rgba(255, 255, 255, 0.1)',
                                boxShadow: activePort === index ? `0 0 15px ${port.color}40` : 'none'
                            }}
                            style={{ '--port-color': port.color }}
                        >
                            <div className="ports-apartment-num" style={{ background: port.color }}>
                                :{port.num}
                            </div>
                            <div className="ports-apartment-icon">
                                <port.icon size={16} color={port.color} />
                            </div>
                            <div className="ports-apartment-info">
                                <span className="ports-service">{t(`visualizations.ports.common.${port.num}.service`)}</span>
                                <span className="ports-desc">{t(`visualizations.ports.common.${port.num}.desc`)}</span>
                            </div>
                            {activePort === index && (
                                <motion.div
                                    className="ports-resident"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    {t('visualizations.ports.resident')}
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

export default PortsViz;
