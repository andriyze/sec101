import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, Building2, Globe, Shield, Eye, EyeOff, Lock } from 'lucide-react';
import VizContainer from './VizContainer';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const VpnTunnelViz = () => {
    const { t } = useTranslation();
    const prefersReducedMotion = usePrefersReducedMotion();

    const sites = ['bank.com', 'email.com', 'social.com'];

    const packetVariants = {
        animate: (i) => ({
            x: [0, 180],
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
            x: [0, 280],
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
        <VizContainer title={t('visualizations.vpn.title')}>
            <div className="vpn-viz-wrapper">
                {/* Without VPN Row */}
                <div className="vpn-viz-row">
                    <span className="vpn-viz-label no-vpn">{t('visualizations.vpn.without')}</span>

                    {/* User */}
                    <div className="viz-node">
                        <div className="viz-node-icon">
                            <User size={20} color="var(--text-main)" />
                        </div>
                        <span className="viz-node-label">{t('visualizations.vpn.you')}</span>
                    </div>

                    {/* Connection to ISP */}
                    <div className="viz-connection" style={{ width: '80px', position: 'relative' }}>
                        {!prefersReducedMotion && sites.map((site, i) => (
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
                    <div className="viz-connection" style={{ width: '60px' }} />

                    {/* Internet */}
                    <div className="viz-node">
                        <div className="viz-node-icon">
                            <Globe size={20} color="var(--primary)" />
                        </div>
                        <span className="viz-node-label">{t('visualizations.vpn.internet')}</span>
                    </div>
                </div>

                {/* With VPN Row */}
                <div className="vpn-viz-row">
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
                        className="viz-connection encrypted"
                        style={{ width: '120px', position: 'relative' }}
                        variants={!prefersReducedMotion ? glowVariants : undefined}
                        animate={!prefersReducedMotion ? 'animate' : undefined}
                    >
                        {!prefersReducedMotion && [0, 1].map((i) => (
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
                    <div className="viz-node">
                        <div className="viz-node-icon" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                            <Building2 size={20} color="var(--text-dim)" />
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
                    <div className="viz-connection" style={{ width: '40px' }} />

                    {/* VPN Server */}
                    <div className="viz-node" style={{ borderColor: 'var(--primary)' }}>
                        <div className="viz-node-icon">
                            <Shield size={20} color="var(--primary)" />
                        </div>
                        <span className="viz-node-label">{t('visualizations.vpn.vpn_server')}</span>
                    </div>

                    {/* Connection to Internet */}
                    <div className="viz-connection" style={{ width: '40px' }} />

                    {/* Internet */}
                    <div className="viz-node">
                        <div className="viz-node-icon">
                            <Globe size={20} color="var(--primary)" />
                        </div>
                        <span className="viz-node-label">{t('visualizations.vpn.internet')}</span>
                    </div>
                </div>
            </div>
        </VizContainer>
    );
};

export default VpnTunnelViz;
