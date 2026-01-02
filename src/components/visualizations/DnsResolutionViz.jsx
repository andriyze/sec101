import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Monitor, Server, Globe, Database, ArrowRight, Lightbulb } from 'lucide-react';
import VizContainer from './VizContainer';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const DnsResolutionViz = () => {
    const { t } = useTranslation();
    const prefersReducedMotion = usePrefersReducedMotion();
    const [currentStep, setCurrentStep] = useState(0);
    const [showingResponse, setShowingResponse] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    // Comprehensive step explanations
    const stepExplanations = [
        {
            id: 'query',
            title: t('visualizations.dns.steps.1.title', 'Browser Asks DNS Resolver'),
            description: t('visualizations.dns.steps.1.short', 'Your device contacts the DNS resolver'),
            detail: t('visualizations.dns.steps.1.detail', 'When you type "google.com", your browser first checks its cache. If not found, it asks your configured DNS resolver.'),
            serverRole: t('visualizations.dns.steps.1.role', 'DNS Resolver: A server that finds IP addresses for you. Like a librarian who knows where to find information.'),
            packetLabel: 'Query: google.com TYPE A'
        },
        {
            id: 'root',
            title: t('visualizations.dns.steps.2.title', 'Resolver Contacts Root Server'),
            description: t('visualizations.dns.steps.2.short', 'Resolver asks: "Who handles .com domains?"'),
            detail: t('visualizations.dns.steps.2.detail', 'The resolver starts at the top of DNS hierarchy - the 13 root server clusters worldwide.'),
            serverRole: t('visualizations.dns.steps.2.role', 'Root Server: The starting point for all DNS queries. Knows which servers handle each top-level domain.'),
            packetLabel: 'Response: Ask .com servers'
        },
        {
            id: 'tld',
            title: t('visualizations.dns.steps.3.title', 'Root Directs to TLD Server'),
            description: t('visualizations.dns.steps.3.short', 'TLD server knows who controls google.com'),
            detail: t('visualizations.dns.steps.3.detail', 'The .com TLD server manages all .com registrations and knows which authoritative servers handle each domain.'),
            serverRole: t('visualizations.dns.steps.3.role', 'TLD Server: Manages a domain extension like .com.'),
            packetLabel: 'Response: ns1.google.com'
        },
        {
            id: 'auth',
            title: t('visualizations.dns.steps.4.title', 'TLD Points to Authoritative Server'),
            description: t('visualizations.dns.steps.4.short', "Google's own DNS server has the answer"),
            detail: t('visualizations.dns.steps.4.detail', "Google's authoritative name server has the definitive answer because Google controls it."),
            serverRole: t('visualizations.dns.steps.4.role', 'Authoritative Server: The final source of truth. Controlled by the domain owner.'),
            packetLabel: '142.250.185.78 (TTL: 300s)'
        },
        {
            id: 'response',
            title: t('visualizations.dns.steps.5.title', 'Answer Returns to You'),
            description: t('visualizations.dns.steps.5.short', 'Your browser now knows where to connect'),
            detail: t('visualizations.dns.steps.5.detail', 'The IP travels back through the resolver and gets cached. Your browser can now connect directly.'),
            serverRole: t('visualizations.dns.steps.5.role', 'Complete: DNS resolution done in 20-120 milliseconds.'),
            packetLabel: 'Cached: google.com'
        }
    ];

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

    // Auto-cycle through steps - SLOWER for better comprehension (4000ms instead of 1500ms)
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
                    setTimeout(() => setShowingResponse(false), 3000);
                    return 0;
                }
                return next;
            });
        }, 4000);

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

    const currentExplanation = stepExplanations[currentStep] || stepExplanations[0];

    return (
        <VizContainer title={t('visualizations.dns.title')}>
            <div className="dns-viz-wrapper">
                {/* Step Explanation Panel */}
                <div className="dns-explanation-panel">
                    <div className="dns-step-header">
                        <span className="dns-step-number">Step {currentStep + 1} of 5</span>
                        <h4 className="dns-step-title">{currentExplanation.title}</h4>
                    </div>
                    <p className="dns-step-desc">{currentExplanation.description}</p>

                    <AnimatePresence>
                        <motion.div
                            className="dns-step-detail"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            key={currentStep}
                        >
                            <p>{currentExplanation.detail}</p>
                            <div className="dns-server-role">
                                <Lightbulb size={14} />
                                <span>{currentExplanation.serverRole}</span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

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

                            {/* Connection arrow with packet label (except after last node) */}
                            {index < nodes.length - 1 && (
                                <div className="dns-connection">
                                    <div className="dns-connection-line" />
                                    <AnimatePresence>
                                        {currentStep === index && !prefersReducedMotion && (
                                            <motion.div
                                                className="dns-packet-wrapper"
                                                variants={packetVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                            >
                                                <div className="dns-packet">
                                                    <ArrowRight size={12} />
                                                </div>
                                                <span className="dns-packet-label">
                                                    {stepExplanations[index]?.packetLabel}
                                                </span>
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

                {/* Technical details toggle */}
                <details className="dns-technical">
                    <summary>Technical Details</summary>
                    <p>
                        DNS uses UDP port 53 for queries. Each step involves a query/response pair.
                        The TTL (Time To Live) determines how long the result is cached.
                        Modern DNS can use encryption (DoH/DoT) to prevent snooping.
                    </p>
                </details>
            </div>
        </VizContainer>
    );
};

export default DnsResolutionViz;
