import React from 'react';
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.div
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, Building2, Globe, Shield, Eye, EyeOff, Lock } from 'lucide-react';
import VizContainer from './VizContainer';
import AnimationControls from './AnimationControls';
import StepCaption from './StepCaption';
import { useAnimationControl } from './useAnimationControl';
import { tArray } from '../../i18n/safeTranslate';

const VpnTunnelViz = () => {
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
        interval: 5000,
        loop: true,
        autoPlay: false
    });

    const sites = ['bank.com', 'email.com', 'social.com'];

    // Step 0: "without VPN" row active. Steps 1-3: "with VPN" row active.
    const vpnActive = currentStep >= 1;
    const ispEmphasized = currentStep === 2;
    const vpnServerEmphasized = currentStep === 3;

    const rowStyle = (isActive) => ({
        opacity: isActive ? 1 : 0.35,
        transition: 'opacity 0.4s ease',
    });

    const emphasisStyle = (isEmphasized, color, glow) => ({
        borderColor: isEmphasized ? color : undefined,
        boxShadow: isEmphasized ? `0 0 15px ${glow}` : 'none',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    });

    const packetVariants = {
        animate: (i) => ({
            x: [0, 60],
            opacity: [0, 1, 1, 0],
            transition: {
                duration: 2.5,
                delay: i * 1.2,
                repeat: Infinity,
                ease: 'linear',
            },
        }),
    };

    const encryptedPacketVariants = {
        animate: (i) => ({
            x: [0, 80],
            opacity: [0, 1, 1, 0],
            transition: {
                duration: 3,
                delay: i * 1.5,
                repeat: Infinity,
                ease: 'linear',
            },
        }),
    };

    const glowVariants = {
        animate: {
            boxShadow: [
                '0 0 5px rgba(0, 242, 255, 0.3)',
                '0 0 15px rgba(0, 242, 255, 0.6)',
                '0 0 5px rgba(0, 242, 255, 0.3)',
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <VizContainer
            title={t('visualizations.vpn.title')}
            whyItMatters={t('visualizations.vpn.why_matters')}
        >
            <div className="vpn-viz-wrapper">
                {/* Without VPN Row */}
                <div className="vpn-viz-row" style={rowStyle(!vpnActive)}>
                    <span className="vpn-viz-label no-vpn">{t('visualizations.vpn.without')}</span>

                    {/* User */}
                    <div className="viz-node">
                        <div className="viz-node-icon">
                            <User size={20} color="var(--text-main)" />
                        </div>
                        <span className="viz-node-label">{t('visualizations.vpn.you')}</span>
                    </div>

                    {/* Connection to ISP */}
                    <div className="viz-connection viz-connection-md">
                        {!prefersReducedMotion && !vpnActive && sites.map((site, i) => (
                            <motion.div
                                key={`packet-${i}`}
                                className="viz-packet visible"
                                custom={i}
                                variants={packetVariants}
                                animate="animate"
                                style={{ left: 0 }}
                            >
                                {site.charAt(0).toUpperCase()}
                            </motion.div>
                        ))}
                    </div>

                    {/* ISP */}
                    <div className="viz-node" style={{ borderColor: 'var(--accent)' }}>
                        <div className="viz-node-icon" style={{ background: 'rgba(255, 0, 85, 0.1)' }}>
                            <Building2 size={20} color="var(--accent)" />
                        </div>
                        <span className="viz-node-label">{t('visualizations.vpn.isp')}</span>
                        <div className="viz-isp-sees">
                            <span className="viz-isp-sees-label">
                                <Eye size={10} /> {t('visualizations.vpn.sees')}
                            </span>
                            <div className="viz-isp-sees-content">
                                {sites.map((site) => (
                                    <span key={site} className="viz-site-tag">{site}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Connection to Internet */}
                    <div className="viz-connection viz-connection-sm" />

                    {/* Internet */}
                    <div className="viz-node">
                        <div className="viz-node-icon">
                            <Globe size={20} color="var(--primary)" />
                        </div>
                        <span className="viz-node-label">{t('visualizations.vpn.internet')}</span>
                    </div>
                </div>

                {/* With VPN Row */}
                <div className="vpn-viz-row" style={rowStyle(vpnActive)}>
                    <span className="vpn-viz-label with-vpn">{t('visualizations.vpn.with')}</span>

                    {/* User */}
                    <div className="viz-node" style={{ borderColor: 'var(--primary)' }}>
                        <div className="viz-node-icon">
                            <User size={20} color="var(--primary)" />
                        </div>
                        <span className="viz-node-label">{t('visualizations.vpn.you')}</span>
                    </div>

                    {/* Encrypted Tunnel */}
                    <motion.div
                        className="viz-connection encrypted viz-connection-lg"
                        variants={!prefersReducedMotion && vpnActive ? glowVariants : undefined}
                        animate={!prefersReducedMotion && vpnActive ? 'animate' : undefined}
                    >
                        {!prefersReducedMotion && vpnActive && [0, 1].map((i) => (
                            <motion.div
                                key={`enc-packet-${i}`}
                                className="viz-packet encrypted"
                                custom={i}
                                variants={encryptedPacketVariants}
                                animate="animate"
                                style={{ left: 0 }}
                            >
                                <Lock size={12} />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* ISP (can't see) */}
                    <div
                        className="viz-node"
                        style={emphasisStyle(ispEmphasized, 'var(--primary)', 'rgba(0, 242, 255, 0.35)')}
                    >
                        <div className="viz-node-icon" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                            <Building2 size={20} color={ispEmphasized ? 'var(--primary)' : 'var(--text-dim)'} />
                        </div>
                        <span className="viz-node-label">{t('visualizations.vpn.isp')}</span>
                        <div className="viz-isp-sees">
                            <span className="viz-isp-sees-label">
                                <EyeOff size={10} /> {t('visualizations.vpn.sees')}
                            </span>
                            <div className="viz-isp-sees-content">
                                <span className="viz-encrypted-tag">
                                    <Lock size={8} /> {t('visualizations.vpn.encrypted')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Connection to VPN Server */}
                    <div className="viz-connection viz-connection-xs" />

                    {/* VPN Server */}
                    <div
                        className="viz-node"
                        style={{
                            borderColor: vpnServerEmphasized ? 'var(--accent)' : 'var(--primary)',
                            boxShadow: vpnServerEmphasized ? '0 0 15px rgba(255, 0, 85, 0.3)' : 'none',
                            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                        }}
                    >
                        <div className="viz-node-icon">
                            <Shield size={20} color={vpnServerEmphasized ? 'var(--accent)' : 'var(--primary)'} />
                        </div>
                        <span className="viz-node-label">{t('visualizations.vpn.vpn_server')}</span>
                        {vpnServerEmphasized && (
                            <div className="viz-isp-sees">
                                <span className="viz-isp-sees-label">
                                    <Eye size={10} /> {t('visualizations.vpn.sees')}
                                </span>
                                <div className="viz-isp-sees-content">
                                    {sites.map((site) => (
                                        <span key={site} className="viz-site-tag">{site}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Connection to Internet */}
                    <div className="viz-connection viz-connection-xs" />

                    {/* Internet */}
                    <div className="viz-node">
                        <div className="viz-node-icon">
                            <Globe size={20} color="var(--primary)" />
                        </div>
                        <span className="viz-node-label">{t('visualizations.vpn.internet')}</span>
                    </div>
                </div>

                <StepCaption
                    steps={tArray(t, 'visualizations.vpn.steps')}
                    currentStep={currentStep}
                />

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

export default VpnTunnelViz;
