import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.span
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Check, Infinity as InfinityIcon, Play, Pause } from 'lucide-react';
import VizContainer from './VizContainer';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const IpVersionsViz = () => {
    const { t } = useTranslation();
    const prefersReducedMotion = usePrefersReducedMotion();
    const [v4Level, setV4Level] = useState(85); // Start at 85% depleted
    const [typingV4, setTypingV4] = useState('');
    const [typingV6, setTypingV6] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const intervalsRef = useRef({ deplete: null, type: null });

    const v4Example = '192.168.1.1';
    const v6Example = '2001:0db8:85a3::7334';

    // Animate IPv4 depletion and address typing
    useEffect(() => {
        if (prefersReducedMotion) {
            setV4Level(92);
            setTypingV4(v4Example);
            setTypingV6(v6Example);
            return;
        }

        if (isPlaying) {
            // Slowly deplete IPv4
            intervalsRef.current.deplete = setInterval(() => {
                setV4Level((prev) => {
                    if (prev >= 95) return 85;
                    return prev + 0.5;
                });
            }, 500);

            // Type out addresses
            let v4Index = 0;
            let v6Index = 0;
            intervalsRef.current.type = setInterval(() => {
                if (v4Index <= v4Example.length) {
                    setTypingV4(v4Example.slice(0, v4Index));
                    v4Index++;
                }
                if (v6Index <= v6Example.length) {
                    setTypingV6(v6Example.slice(0, v6Index));
                    v6Index++;
                }
                if (v4Index > v4Example.length && v6Index > v6Example.length) {
                    // Reset after a pause
                    setTimeout(() => {
                        v4Index = 0;
                        v6Index = 0;
                    }, 2000);
                }
            }, 150);
        } else {
            // Clear intervals when paused
            if (intervalsRef.current.deplete) {
                clearInterval(intervalsRef.current.deplete);
                intervalsRef.current.deplete = null;
            }
            if (intervalsRef.current.type) {
                clearInterval(intervalsRef.current.type);
                intervalsRef.current.type = null;
            }
        }

        // Capture ref at effect start for cleanup
        const currentIntervals = intervalsRef.current;
        return () => {
            if (currentIntervals.deplete) clearInterval(currentIntervals.deplete);
            if (currentIntervals.type) clearInterval(currentIntervals.type);
        };
    }, [isPlaying, prefersReducedMotion]);

    const togglePlay = () => {
        if (prefersReducedMotion) return;
        setIsPlaying(prev => !prev);
    };

    return (
        <VizContainer title={t('visualizations.ipv.title')}>
            <div className="ipv-viz-wrapper">
                <div className="ipv-comparison">
                    {/* IPv4 */}
                    <div className="ipv-version v4">
                        <div className="ipv-header">
                            <AlertTriangle size={18} color="var(--accent)" />
                            <span className="ipv-label">{t('visualizations.ipv.v4_label')}</span>
                        </div>

                        <div className="ipv-address">
                            <span className="ipv-address-text">{typingV4 || t('visualizations.ipv.v4_example')}</span>
                            {isPlaying && !prefersReducedMotion && (
                                <motion.span
                                    className="ipv-cursor"
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                >|</motion.span>
                            )}
                        </div>

                        <div className="ipv-pool">
                            <div className="ipv-pool-label">{t('visualizations.ipv.v4_count')}</div>
                            <div className="ipv-pool-bar">
                                <motion.div
                                    className="ipv-pool-fill depleted"
                                    animate={{ width: `${v4Level}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <div className="ipv-pool-status depleted">
                                <AlertTriangle size={12} />
                                <span>{t('visualizations.ipv.exhausted')}</span>
                            </div>
                        </div>
                    </div>

                    {/* VS Divider */}
                    <div className="ipv-divider">
                        <span>vs</span>
                    </div>

                    {/* IPv6 */}
                    <div className="ipv-version v6">
                        <div className="ipv-header">
                            <Check size={18} color="#00ff9d" />
                            <span className="ipv-label">{t('visualizations.ipv.v6_label')}</span>
                        </div>

                        <div className="ipv-address">
                            <span className="ipv-address-text v6">{typingV6 || t('visualizations.ipv.v6_example')}</span>
                            {isPlaying && !prefersReducedMotion && (
                                <motion.span
                                    className="ipv-cursor"
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                >|</motion.span>
                            )}
                        </div>

                        <div className="ipv-pool">
                            <div className="ipv-pool-label">{t('visualizations.ipv.v6_count')}</div>
                            <div className="ipv-pool-bar">
                                <div className="ipv-pool-fill unlimited" style={{ width: '100%' }} />
                                {isPlaying && !prefersReducedMotion && (
                                    <motion.div
                                        className="ipv-pool-infinite"
                                        animate={{ x: [0, 10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <InfinityIcon size={16} color="#00ff9d" />
                                    </motion.div>
                                )}
                                {!isPlaying && (
                                    <div className="ipv-pool-infinite">
                                        <InfinityIcon size={16} color="#00ff9d" />
                                    </div>
                                )}
                            </div>
                            <div className="ipv-pool-status unlimited">
                                <Check size={12} />
                                <span>{t('visualizations.ipv.unlimited')}</span>
                            </div>
                        </div>
                    </div>
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

export default IpVersionsViz;
