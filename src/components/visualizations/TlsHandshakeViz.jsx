import React from 'react';
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.div
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Monitor, Server, ArrowRight, ArrowLeft, Lock, Key, ShieldCheck, Lightbulb } from 'lucide-react';
import VizContainer from './VizContainer';
import AnimationControls from './AnimationControls';
import { useAnimationControl } from './useAnimationControl';
import { tArray } from '../../i18n/safeTranslate';

const TlsHandshakeViz = () => {
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
        totalSteps: 4,
        interval: 4500,
        loop: true
    });

    // Detailed step explanations with analogies
    const tlsStepsDetailed = [
        {
            id: 'client_hello',
            title: t('visualizations.tls.steps.1.title', 'Client Hello'),
            shortDesc: t('visualizations.tls.steps.1.short', 'Browser introduces itself'),
            detail: t('visualizations.tls.steps.1.detail', 'Your browser sends: "Hi, I support TLS 1.3, and here are the encryption methods I know"'),
            whatsSent: tArray(t, 'visualizations.tls.steps.1.sent', { defaultValue: ['TLS versions', 'Cipher suites', 'Random number'] }),
            analogy: t('visualizations.tls.steps.1.analogy', 'Like showing your ID at a secure building entrance'),
            direction: 'right',
            icon: ArrowRight,
            color: 'var(--primary)'
        },
        {
            id: 'server_hello',
            title: t('visualizations.tls.steps.2.title', 'Server Hello + Certificate'),
            shortDesc: t('visualizations.tls.steps.2.short', 'Server proves its identity'),
            detail: t('visualizations.tls.steps.2.detail', 'Server responds: "Let\'s use TLS 1.3 with AES-256. Here\'s my certificate proving I\'m really google.com"'),
            whatsSent: tArray(t, 'visualizations.tls.steps.2.sent', { defaultValue: ['Chosen cipher', 'Server certificate', 'Server random'] }),
            analogy: t('visualizations.tls.steps.2.analogy', 'Like the guard showing their badge and company ID'),
            direction: 'left',
            icon: ArrowLeft,
            color: 'var(--secondary)'
        },
        {
            id: 'key_exchange',
            title: t('visualizations.tls.steps.3.title', 'Key Exchange'),
            shortDesc: t('visualizations.tls.steps.3.short', 'Creating a shared secret'),
            detail: t('visualizations.tls.steps.3.detail', 'Both sides use Diffie-Hellman to create a shared secret key without ever sending it directly'),
            whatsSent: tArray(t, 'visualizations.tls.steps.3.sent', { defaultValue: ['Pre-master secret', 'Session keys'] }),
            analogy: t('visualizations.tls.steps.3.analogy', 'Like mixing colors - each adds their secret, neither knows the other\'s original'),
            direction: 'right',
            icon: Key,
            color: '#ffa94d'
        },
        {
            id: 'secure',
            title: t('visualizations.tls.steps.4.title', 'Secure Connection'),
            shortDesc: t('visualizations.tls.steps.4.short', 'Ready to talk privately'),
            detail: t('visualizations.tls.steps.4.detail', 'Both sides now have matching session keys. All future messages are encrypted.'),
            whatsSent: tArray(t, 'visualizations.tls.steps.4.sent', { defaultValue: ['AES-256 active', 'HMAC enabled'] }),
            analogy: t('visualizations.tls.steps.4.analogy', 'Like having a private language only you two understand'),
            direction: 'both',
            icon: Lock,
            color: '#00ff9d'
        }
    ];

    const steps = [
        { id: 'step1', direction: 'right', icon: ArrowRight, color: 'var(--primary)' },
        { id: 'step2', direction: 'left', icon: ArrowLeft, color: 'var(--secondary)' },
        { id: 'step3', direction: 'right', icon: Key, color: '#ffa94d' },
        { id: 'step4', direction: 'both', icon: Lock, color: '#00ff9d' },
    ];

    const messageVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 25 }
        },
        exit: { opacity: 0, scale: 0.5 }
    };

    const isSecure = currentStep === 3;

    return (
        <VizContainer title={t('visualizations.tls.title')}>
            <div className="tls-viz-wrapper">
                {/* Step Explanation Panel */}
                <div className="tls-explanation-panel" aria-live="polite" aria-atomic="true">
                    <div className="tls-step-header">
                        <span className="tls-step-number">{t('visualizations.tls.step_of', { current: currentStep + 1, total: 4 })}</span>
                        <h4 className="tls-step-title">{tlsStepsDetailed[currentStep].title}</h4>
                    </div>
                    <p className="tls-step-desc">{tlsStepsDetailed[currentStep].shortDesc}</p>

                    <AnimatePresence>
                        <motion.div
                            className="tls-step-detail"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={currentStep}
                        >
                            <p>{tlsStepsDetailed[currentStep].detail}</p>

                            {/* What's being sent */}
                            <div className="tls-whats-sent">
                                {tlsStepsDetailed[currentStep].whatsSent.map((item, i) => (
                                    <span key={i} className="tls-sent-item">{item}</span>
                                ))}
                            </div>

                            {/* Analogy */}
                            <div className="tls-analogy">
                                <Lightbulb size={14} />
                                <span>{tlsStepsDetailed[currentStep].analogy}</span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Endpoints */}
                <div className="tls-endpoints">
                    {/* Browser */}
                    <motion.div
                        className="tls-endpoint browser"
                        animate={{
                            borderColor: isSecure ? '#00ff9d' : 'rgba(255, 255, 255, 0.1)',
                            boxShadow: isSecure ? '0 0 20px rgba(0, 255, 157, 0.3)' : 'none'
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
                            {!prefersReducedMotion && steps[currentStep] && (
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
                            {isSecure && (
                                <motion.div
                                    className="tls-secure-tunnel"
                                    initial={{ opacity: 0, scaleX: 0 }}
                                    animate={{ opacity: 1, scaleX: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ position: 'absolute', bottom: '-30px' }}
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
                            borderColor: isSecure ? '#00ff9d' : 'rgba(255, 255, 255, 0.1)',
                            boxShadow: isSecure ? '0 0 20px rgba(0, 255, 157, 0.3)' : 'none'
                        }}
                    >
                        <Server size={28} color="var(--secondary)" />
                        <span>{t('visualizations.tls.server')}</span>
                    </motion.div>
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

                {/* Why It Matters */}
                <div className="tls-why-matters">
                    <p>
                        <Lock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {t('visualizations.tls.why_matters', 'Without TLS, passwords and personal data travel in plain text anyone can intercept. Always look for the padlock icon in your browser.')}
                    </p>
                </div>
            </div>
        </VizContainer>
    );
};

export default TlsHandshakeViz;
