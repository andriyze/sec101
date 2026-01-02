import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, Globe, Eye, EyeOff, ShieldOff, ShieldCheck } from 'lucide-react';
import VizContainer from './VizContainer';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const TrackerBlockingViz = () => {
    const { t } = useTranslation();
    const prefersReducedMotion = usePrefersReducedMotion();
    const [blocked, setBlocked] = useState(false);
    const [trackerData, setTrackerData] = useState([]);
    const [currentSite, setCurrentSite] = useState(0);

    const sites = [
        { name: 'news.com', color: '#4a9eff' },
        { name: 'shop.com', color: '#ff6b6b' },
        { name: 'social.com', color: '#a855f7' },
    ];

    // Auto-cycle: show unblocked, then blocked
    useEffect(() => {
        if (prefersReducedMotion) {
            setBlocked(true);
            return;
        }

        // Cycle through sites, then toggle blocked state
        const siteInterval = setInterval(() => {
            setCurrentSite((prev) => {
                const next = (prev + 1) % sites.length;
                if (next === 0) {
                    // After completing a cycle, toggle blocked state
                    setTimeout(() => {
                        setBlocked((b) => !b);
                        setTrackerData([]);
                    }, 500);
                }
                return next;
            });
        }, 1500);

        return () => clearInterval(siteInterval);
    }, [prefersReducedMotion]);

    // Add tracker data when not blocked
    useEffect(() => {
        if (!blocked && !prefersReducedMotion) {
            const timer = setTimeout(() => {
                setTrackerData((prev) => {
                    if (prev.length < 3) {
                        return [...prev, sites[currentSite].name];
                    }
                    return prev;
                });
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [currentSite, blocked, prefersReducedMotion]);

    const trackerVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0, opacity: 0 },
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
            transition: { duration: 1.5, repeat: Infinity },
        },
    };

    const blockedVariants = {
        initial: { scale: 0, rotate: -180 },
        animate: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 200 } },
    };

    return (
        <VizContainer>
            <div className="tracker-viz-wrapper">
                {/* Header */}
                <div className="tracker-header">
                    <div className={`tracker-status ${blocked ? 'protected' : 'exposed'}`}>
                        {blocked ? <ShieldCheck size={16} /> : <ShieldOff size={16} />}
                        <span>{blocked ? t('visualizations.tracker.protected') : t('visualizations.tracker.exposed')}</span>
                    </div>
                </div>

                {/* Main visualization */}
                <div className="tracker-flow">
                    {/* User */}
                    <div className="tracker-node user">
                        <div className="tracker-node-icon">
                            <User size={20} color="var(--primary)" />
                        </div>
                        <span className="tracker-node-label">{t('visualizations.tracker.you')}</span>
                    </div>

                    {/* Sites with trackers */}
                    <div className="tracker-sites">
                        {sites.map((site, index) => {
                            const isActive = index === currentSite;
                            const wasVisited = index < currentSite || (index === currentSite && trackerData.includes(site.name));

                            return (
                                <div key={site.name} className="tracker-site-wrapper">
                                    {/* Connection line */}
                                    <motion.div
                                        className="tracker-connection"
                                        animate={{
                                            opacity: isActive ? 1 : 0.3,
                                            background: isActive
                                                ? `linear-gradient(90deg, var(--primary), ${site.color})`
                                                : 'var(--border-light)',
                                        }}
                                    />

                                    {/* Site node */}
                                    <motion.div
                                        className={`tracker-node site ${isActive ? 'active' : ''}`}
                                        animate={{
                                            borderColor: isActive ? site.color : 'var(--border-light)',
                                            boxShadow: isActive ? `0 0 15px ${site.color}40` : 'none',
                                        }}
                                    >
                                        <div className="tracker-node-icon" style={{ background: `${site.color}20` }}>
                                            <Globe size={16} color={site.color} />
                                        </div>
                                        <span className="tracker-node-label">{site.name}</span>

                                        {/* Tracker eye */}
                                        <AnimatePresence>
                                            {isActive && !blocked && (
                                                <motion.div
                                                    className="tracker-eye"
                                                    variants={trackerVariants}
                                                    initial="initial"
                                                    animate="animate"
                                                    exit="exit"
                                                >
                                                    <motion.div variants={!prefersReducedMotion ? pulseVariants : undefined} animate="animate">
                                                        <Eye size={14} color="var(--accent)" />
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                            {isActive && blocked && (
                                                <motion.div
                                                    className="tracker-blocked"
                                                    variants={blockedVariants}
                                                    initial="initial"
                                                    animate="animate"
                                                >
                                                    <EyeOff size={14} color="#00ff9d" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Tracker profile (only when not blocked) */}
                    <AnimatePresence>
                        {!blocked && trackerData.length > 0 && (
                            <motion.div
                                className="tracker-profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="tracker-profile-header">
                                    <Eye size={14} color="var(--accent)" />
                                    <span>{t('visualizations.tracker.profile')}</span>
                                </div>
                                <div className="tracker-profile-data">
                                    {trackerData.map((site, i) => (
                                        <motion.span
                                            key={i}
                                            className="tracker-data-item"
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            {site}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        {blocked && (
                            <motion.div
                                className="tracker-profile blocked"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="tracker-profile-header">
                                    <EyeOff size={14} color="#00ff9d" />
                                    <span>{t('visualizations.tracker.no_profile')}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Explanation */}
                <p className="tracker-explanation">
                    {blocked
                        ? t('visualizations.tracker.explanation_blocked')
                        : t('visualizations.tracker.explanation_exposed')
                    }
                </p>
            </div>
        </VizContainer>
    );
};

export default TrackerBlockingViz;
