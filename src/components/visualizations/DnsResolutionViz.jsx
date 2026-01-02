import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Monitor, Server, Globe, Database, ArrowRight } from 'lucide-react';
import VizContainer from './VizContainer';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const DnsResolutionViz = () => {
    const { t } = useTranslation();
    const prefersReducedMotion = usePrefersReducedMotion();
    const [currentStep, setCurrentStep] = useState(0);
    const [showingResponse, setShowingResponse] = useState(false);

    const steps = [
        { id: 'query', from: 0, to: 1 },      // Device to Resolver
        { id: 'root', from: 1, to: 2 },       // Resolver to Root
        { id: 'tld', from: 2, to: 3 },        // Root to TLD
        { id: 'auth', from: 3, to: 4 },       // TLD to Auth
        { id: 'response', from: 4, to: 0 },   // Response back
    ];

    const nodes = [
        { id: 'device', icon: Monitor, label: t('visualizations.dns.your_device'), color: 'var(--primary)' },
        { id: 'resolver', icon: Server, label: t('visualizations.dns.resolver'), color: 'var(--secondary)' },
        { id: 'root', icon: Database, label: t('visualizations.dns.root'), color: '#ff6b6b' },
        { id: 'tld', icon: Database, label: t('visualizations.dns.tld'), color: '#ffa94d' },
        { id: 'auth', icon: Globe, label: t('visualizations.dns.auth'), color: '#00ff9d' },
    ];

    // Auto-cycle through steps
    useEffect(() => {
        if (prefersReducedMotion) {
            setCurrentStep(4);
            setShowingResponse(true);
            return;
        }

        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                const next = (prev + 1) % 6;
                if (next === 5) {
                    setShowingResponse(true);
                    setTimeout(() => setShowingResponse(false), 1500);
                    return 0;
                }
                return next;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [prefersReducedMotion]);

    const packetVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 25 }
        },
        exit: { scale: 0, opacity: 0 }
    };

    const nodeGlowVariants = {
        inactive: { boxShadow: 'none' },
        active: {
            boxShadow: '0 0 20px rgba(0, 242, 255, 0.5)',
            transition: { duration: 0.3 }
        }
    };

    const isNodeActive = (index) => {
        if (currentStep < steps.length) {
            return steps[currentStep]?.from === index || steps[currentStep]?.to === index;
        }
        return false;
    };

    return (
        <VizContainer title={t('visualizations.dns.title')}>
            <div className="dns-viz-wrapper">
                {/* Query display */}
                <div className="dns-query-display">
                    <span className="dns-query-text">
                        {t('visualizations.dns.query')} <strong>google.com</strong>
                    </span>
                    <AnimatePresence>
                        {showingResponse && (
                            <motion.span
                                className="dns-response-text"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                {t('visualizations.dns.response')} <strong>142.250.185.78</strong>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* DNS Flow */}
                <div className="dns-flow">
                    {nodes.map((node, index) => (
                        <React.Fragment key={node.id}>
                            {/* Node */}
                            <motion.div
                                className={`dns-node ${isNodeActive(index) ? 'active' : ''}`}
                                variants={nodeGlowVariants}
                                animate={isNodeActive(index) ? 'active' : 'inactive'}
                                style={{ '--node-color': node.color }}
                            >
                                <div className="dns-node-icon" style={{ borderColor: node.color }}>
                                    <node.icon size={18} color={node.color} />
                                </div>
                                <span className="dns-node-label">{node.label}</span>
                            </motion.div>

                            {/* Connection arrow (except after last node) */}
                            {index < nodes.length - 1 && (
                                <div className="dns-connection">
                                    <div className="dns-connection-line" />
                                    <AnimatePresence>
                                        {currentStep === index && !prefersReducedMotion && (
                                            <motion.div
                                                className="dns-packet"
                                                variants={packetVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                            >
                                                <ArrowRight size={12} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step indicator */}
                <div className="dns-steps">
                    {['1', '2', '3', '4', '5'].map((num, i) => (
                        <div
                            key={i}
                            className={`dns-step ${currentStep === i ? 'active' : ''} ${currentStep > i ? 'done' : ''}`}
                        >
                            {num}
                        </div>
                    ))}
                </div>
            </div>
        </VizContainer>
    );
};

export default DnsResolutionViz;
