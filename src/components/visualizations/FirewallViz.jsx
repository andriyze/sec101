import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Monitor, Shield, Globe, Check, X, Play, Pause } from 'lucide-react';
import VizContainer from './VizContainer';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const FirewallViz = () => {
    const { t } = useTranslation();
    const prefersReducedMotion = usePrefersReducedMotion();
    const [packets, setPackets] = useState([]);
    const [packetId, setPacketId] = useState(0);
    const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);
    const intervalRef = useRef(null);

    const generatePacket = useCallback(() => {
        const allowed = Math.random() > 0.4; // 60% allowed
        const ports = allowed ? [80, 443, 22] : [23, 3389, 8080];
        const port = ports[Math.floor(Math.random() * ports.length)];

        const newPacket = {
            id: packetId,
            allowed,
            port,
            status: 'incoming'
        };

        setPackets(prev => [...prev.slice(-4), newPacket]);
        setPacketId(prev => prev + 1);

        // Update packet status
        setTimeout(() => {
            setPackets(prev => prev.map(p =>
                p.id === newPacket.id ? { ...p, status: 'checking' } : p
            ));
        }, 400);

        setTimeout(() => {
            setPackets(prev => prev.map(p =>
                p.id === newPacket.id ? { ...p, status: allowed ? 'passed' : 'blocked' } : p
            ));
        }, 800);

        setTimeout(() => {
            setPackets(prev => prev.filter(p => p.id !== newPacket.id));
        }, 1800);
    }, [packetId]);

    // Handle play/pause
    useEffect(() => {
        if (prefersReducedMotion) {
            setPackets([
                { id: 1, allowed: true, port: 443, status: 'passed' },
                { id: 2, allowed: false, port: 23, status: 'blocked' },
            ]);
            return;
        }

        if (isPlaying) {
            intervalRef.current = setInterval(generatePacket, 2000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, prefersReducedMotion, generatePacket]);

    const togglePlay = () => {
        if (prefersReducedMotion) return;
        setIsPlaying(prev => !prev);
    };

    const packetVariants = {
        incoming: { x: -80, opacity: 0 },
        checking: { x: 0, opacity: 1, scale: 1.1 },
        passed: { x: 100, opacity: 0.5 },
        blocked: { x: 0, opacity: 0, scale: 0 }
    };

    return (
        <VizContainer title={t('visualizations.firewall.title')}>
            <div className="firewall-viz-wrapper">
                {/* Network zones */}
                <div className="firewall-zones">
                    {/* External */}
                    <div className="firewall-zone external">
                        <Globe size={24} color="var(--accent)" />
                        <span>{t('visualizations.firewall.external')}</span>
                    </div>

                    {/* Firewall */}
                    <div className="firewall-wall">
                        <Shield size={28} color="var(--primary)" />
                        <div className="firewall-rules">
                            <span className="firewall-rule allow">:443 ✓</span>
                            <span className="firewall-rule allow">:80 ✓</span>
                            <span className="firewall-rule deny">:23 ✗</span>
                        </div>
                    </div>

                    {/* Internal */}
                    <div className="firewall-zone internal">
                        <Monitor size={24} color="#00ff9d" />
                        <span>{t('visualizations.firewall.internal')}</span>
                    </div>
                </div>

                {/* Packet flow */}
                <div className="firewall-packets">
                    <AnimatePresence>
                        {packets.map((packet) => (
                            <motion.div
                                key={packet.id}
                                className={`firewall-packet ${packet.allowed ? 'allowed' : 'blocked'} ${packet.status}`}
                                variants={packetVariants}
                                initial="incoming"
                                animate={packet.status}
                                exit={{ opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            >
                                <span className="firewall-packet-port">:{packet.port}</span>
                                {packet.status === 'checking' && (
                                    <span className="firewall-checking">{t('visualizations.firewall.checking')}</span>
                                )}
                                {packet.status === 'passed' && <Check size={12} />}
                                {packet.status === 'blocked' && <X size={12} />}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Legend */}
                <div className="firewall-legend">
                    <span className="firewall-legend-item allowed">
                        <Check size={12} /> {t('visualizations.firewall.allowed')}
                    </span>
                    <span className="firewall-legend-item blocked">
                        <X size={12} /> {t('visualizations.firewall.blocked')}
                    </span>
                </div>

                {/* Simple Play/Pause Control */}
                <div className={`animation-controls ${prefersReducedMotion ? 'disabled' : ''}`}>
                    <button
                        className="animation-control-btn play-pause"
                        onClick={togglePlay}
                        disabled={prefersReducedMotion}
                        aria-label={isPlaying ? t('controls.pause', 'Pause animation') : t('controls.play', 'Play animation')}
                        title={isPlaying ? t('controls.pause', 'Pause') : t('controls.play', 'Play')}
                    >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                </div>
            </div>
        </VizContainer>
    );
};

export default FirewallViz;
