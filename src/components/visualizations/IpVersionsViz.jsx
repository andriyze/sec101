import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Check, Infinity } from 'lucide-react';
import VizContainer from './VizContainer';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const IpVersionsViz = () => {
    const { t } = useTranslation();
    const prefersReducedMotion = usePrefersReducedMotion();
    const [v4Level, setV4Level] = useState(85); // Start at 85% depleted
    const [typingV4, setTypingV4] = useState('');
    const [typingV6, setTypingV6] = useState('');

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

        // Slowly deplete IPv4
        const depleteInterval = setInterval(() => {
            setV4Level((prev) => {
                if (prev >= 95) return 85;
                return prev + 0.5;
            });
        }, 500);

        // Type out addresses
        let v4Index = 0;
        let v6Index = 0;
        const typeInterval = setInterval(() => {
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

        return () => {
            clearInterval(depleteInterval);
            clearInterval(typeInterval);
        };
    }, [prefersReducedMotion]);

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
                            <motion.span
                                className="ipv-cursor"
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            >|</motion.span>
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
                            <motion.span
                                className="ipv-cursor"
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            >|</motion.span>
                        </div>

                        <div className="ipv-pool">
                            <div className="ipv-pool-label">{t('visualizations.ipv.v6_count')}</div>
                            <div className="ipv-pool-bar">
                                <div className="ipv-pool-fill unlimited" style={{ width: '100%' }} />
                                <motion.div
                                    className="ipv-pool-infinite"
                                    animate={{ x: [0, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Infinity size={16} color="#00ff9d" />
                                </motion.div>
                            </div>
                            <div className="ipv-pool-status unlimited">
                                <Check size={12} />
                                <span>{t('visualizations.ipv.unlimited')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </VizContainer>
    );
};

export default IpVersionsViz;
