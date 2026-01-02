import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Radio, Network, Globe, Truck, Link2, Lock, AppWindow, ArrowDown, ArrowUp } from 'lucide-react';
import VizContainer from './VizContainer';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const OsiModelViz = () => {
    const { t } = useTranslation();
    const prefersReducedMotion = usePrefersReducedMotion();
    const [activeLayer, setActiveLayer] = useState(-1);
    const [direction, setDirection] = useState('down'); // 'down' = sending, 'up' = receiving

    const layers = [
        { num: 7, key: 'application', icon: AppWindow, color: '#00f2ff' },
        { num: 6, key: 'presentation', icon: Lock, color: '#00d4ff' },
        { num: 5, key: 'session', icon: Link2, color: '#00b8ff' },
        { num: 4, key: 'transport', icon: Truck, color: '#7000ff' },
        { num: 3, key: 'network', icon: Globe, color: '#9933ff' },
        { num: 2, key: 'datalink', icon: Network, color: '#ff0055' },
        { num: 1, key: 'physical', icon: Radio, color: '#ff3366' },
    ];

    // Auto-cycle through layers
    useEffect(() => {
        if (prefersReducedMotion) {
            setActiveLayer(3);
            return;
        }

        const interval = setInterval(() => {
            setActiveLayer((prev) => {
                if (direction === 'down') {
                    if (prev >= 6) {
                        setDirection('up');
                        return 6;
                    }
                    return prev + 1;
                } else {
                    if (prev <= 0) {
                        setDirection('down');
                        return -1;
                    }
                    return prev - 1;
                }
            });
        }, 800);

        return () => clearInterval(interval);
    }, [prefersReducedMotion, direction]);

    const layerVariants = {
        inactive: {
            scale: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        active: {
            scale: 1.02,
            transition: { type: 'spring', stiffness: 300, damping: 25 }
        }
    };

    return (
        <VizContainer title={t('visualizations.osi.title')}>
            <div className="osi-viz-wrapper">
                {/* Direction indicator */}
                <div className="osi-direction">
                    <motion.div
                        className="osi-direction-icon"
                        animate={{ y: direction === 'down' ? [0, 5, 0] : [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        {direction === 'down' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                    </motion.div>
                    <span>{direction === 'down' ? t('visualizations.osi.sending') : t('visualizations.osi.receiving')}</span>
                </div>

                {/* OSI Layers Stack */}
                <div className="osi-stack">
                    {layers.map((layer, index) => (
                        <motion.div
                            key={layer.key}
                            className={`osi-layer ${activeLayer === index ? 'active' : ''}`}
                            variants={layerVariants}
                            animate={activeLayer === index ? 'active' : 'inactive'}
                            style={{
                                '--layer-color': layer.color,
                                borderColor: activeLayer === index ? layer.color : undefined,
                                boxShadow: activeLayer === index ? `0 0 20px ${layer.color}40` : undefined
                            }}
                        >
                            <div className="osi-layer-num" style={{ background: layer.color }}>
                                {layer.num}
                            </div>
                            <div className="osi-layer-icon">
                                <layer.icon size={18} color={layer.color} />
                            </div>
                            <div className="osi-layer-info">
                                <span className="osi-layer-name">{t(`visualizations.osi.layers.${layer.key}.name`)}</span>
                                <span className="osi-layer-example">{t(`visualizations.osi.layers.${layer.key}.example`)}</span>
                            </div>
                            {activeLayer === index && (
                                <motion.div
                                    className="osi-data-packet"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ background: layer.color }}
                                >
                                    {t('visualizations.osi.data')}
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </VizContainer>
    );
};

export default OsiModelViz;
