import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock, Unlock, Check, X, Zap } from 'lucide-react';
import VizContainer from './VizContainer';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const ProtocolsViz = () => {
    const { t } = useTranslation();
    const prefersReducedMotion = usePrefersReducedMotion();
    const [comparison, setComparison] = useState('http'); // 'http' or 'tcp'
    const [animationStep, setAnimationStep] = useState(0);

    // Toggle between comparisons and animate
    useEffect(() => {
        if (prefersReducedMotion) {
            setAnimationStep(2);
            return;
        }

        const stepInterval = setInterval(() => {
            setAnimationStep((prev) => {
                if (prev >= 3) {
                    // Switch comparison type
                    setComparison((c) => c === 'http' ? 'tcp' : 'http');
                    return 0;
                }
                return prev + 1;
            });
        }, 1200);

        return () => clearInterval(stepInterval);
    }, [prefersReducedMotion]);

    const packetVariants = {
        hidden: { x: -50, opacity: 0 },
        visible: { x: 0, opacity: 1 },
        sent: { x: 150, opacity: 0, transition: { duration: 0.8 } }
    };

    return (
        <VizContainer title={t('visualizations.protocols.title')}>
            <div className="protocols-viz-wrapper">
                {/* Comparison toggle */}
                <div className="protocols-toggle">
                    <button
                        className={`protocols-toggle-btn ${comparison === 'http' ? 'active' : ''}`}
                        onClick={() => { setComparison('http'); setAnimationStep(0); }}
                    >
                        HTTP / HTTPS
                    </button>
                    <button
                        className={`protocols-toggle-btn ${comparison === 'tcp' ? 'active' : ''}`}
                        onClick={() => { setComparison('tcp'); setAnimationStep(0); }}
                    >
                        TCP / UDP
                    </button>
                </div>

                {comparison === 'http' ? (
                    <div className="protocols-comparison">
                        {/* HTTP Lane */}
                        <div className="protocols-lane http">
                            <div className="protocols-lane-header">
                                <Unlock size={16} color="var(--accent)" />
                                <span>{t('visualizations.protocols.http_label')}</span>
                            </div>
                            <div className="protocols-lane-track">
                                <AnimatePresence>
                                    {animationStep >= 1 && (
                                        <motion.div
                                            className="protocols-packet plain"
                                            variants={packetVariants}
                                            initial="hidden"
                                            animate={animationStep >= 3 ? 'sent' : 'visible'}
                                            exit="sent"
                                        >
                                            <span>{t('visualizations.protocols.message')}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="protocols-watcher">
                                    <Eye size={18} color="var(--accent)" />
                                    <span>{t('visualizations.protocols.visible')}</span>
                                </div>
                            </div>
                        </div>

                        {/* HTTPS Lane */}
                        <div className="protocols-lane https">
                            <div className="protocols-lane-header">
                                <Lock size={16} color="#00ff9d" />
                                <span>{t('visualizations.protocols.https_label')}</span>
                            </div>
                            <div className="protocols-lane-track">
                                <AnimatePresence>
                                    {animationStep >= 1 && (
                                        <motion.div
                                            className="protocols-packet encrypted"
                                            variants={packetVariants}
                                            initial="hidden"
                                            animate={animationStep >= 3 ? 'sent' : 'visible'}
                                            exit="sent"
                                        >
                                            <Lock size={14} />
                                            <span>***</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="protocols-watcher safe">
                                    <EyeOff size={18} color="#00ff9d" />
                                    <span>{t('visualizations.protocols.encrypted')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="protocols-comparison">
                        {/* TCP Lane */}
                        <div className="protocols-lane tcp">
                            <div className="protocols-lane-header">
                                <Check size={16} color="#00ff9d" />
                                <span>{t('visualizations.protocols.tcp_label')}</span>
                            </div>
                            <div className="protocols-lane-track">
                                <div className="protocols-packets-row">
                                    {[1, 2, 3].map((num) => (
                                        <motion.div
                                            key={num}
                                            className="protocols-packet tcp-packet"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{
                                                opacity: animationStep >= num ? 1 : 0.3,
                                                y: 0
                                            }}
                                            transition={{ delay: num * 0.2 }}
                                        >
                                            {num}
                                        </motion.div>
                                    ))}
                                </div>
                                <span className="protocols-trait">{t('visualizations.protocols.reliable')}</span>
                            </div>
                        </div>

                        {/* UDP Lane */}
                        <div className="protocols-lane udp">
                            <div className="protocols-lane-header">
                                <Zap size={16} color="#ffa94d" />
                                <span>{t('visualizations.protocols.udp_label')}</span>
                            </div>
                            <div className="protocols-lane-track">
                                <div className="protocols-packets-row">
                                    {[1, 2, 3].map((num) => (
                                        <motion.div
                                            key={num}
                                            className={`protocols-packet udp-packet ${num === 2 ? 'lost' : ''}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{
                                                opacity: animationStep >= 1 ? (num === 2 ? 0.3 : 1) : 0.3,
                                                y: 0,
                                                scale: num === 2 && animationStep >= 2 ? 0.8 : 1
                                            }}
                                            transition={{ delay: num * 0.1 }}
                                        >
                                            {num === 2 ? <X size={12} /> : num}
                                        </motion.div>
                                    ))}
                                </div>
                                <span className="protocols-trait">{t('visualizations.protocols.fast')}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </VizContainer>
    );
};

export default ProtocolsViz;
