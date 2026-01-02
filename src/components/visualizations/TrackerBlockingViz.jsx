import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    User, Globe, Eye, EyeOff, ShieldOff, ShieldCheck,
    FileText, Clock, MousePointer, ShoppingCart, DollarSign,
    XCircle, Heart, Users, MessageCircle, AlertTriangle, Target, Mail, Database
} from 'lucide-react';
import VizContainer from './VizContainer';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const TrackerBlockingViz = () => {
    const { t } = useTranslation();
    const prefersReducedMotion = usePrefersReducedMotion();
    const [blocked, setBlocked] = useState(false);
    const [trackerData, setTrackerData] = useState([]);
    const [currentSite, setCurrentSite] = useState(0);

    // Detailed tracker data per site
    const trackerDataTypes = {
        'news.com': {
            color: '#4a9eff',
            trackers: ['Google Analytics', 'Facebook Pixel', 'Criteo'],
            dataCollected: [
                { type: 'Articles Read', icon: FileText, value: 'Politics, Tech, Sports' },
                { type: 'Time Spent', icon: Clock, value: '4 min on politics' },
                { type: 'Scroll Depth', icon: MousePointer, value: '85% of article' }
            ]
        },
        'shop.com': {
            color: '#ff6b6b',
            trackers: ['Google Ads', 'Amazon', 'Pinterest'],
            dataCollected: [
                { type: 'Products Viewed', icon: ShoppingCart, value: 'Laptop, Headphones' },
                { type: 'Price Checks', icon: DollarSign, value: 'Compared 3 times' },
                { type: 'Cart Status', icon: XCircle, value: 'Abandoned checkout' }
            ]
        },
        'social.com': {
            color: '#a855f7',
            trackers: ['Meta Pixel', 'TikTok Analytics'],
            dataCollected: [
                { type: 'Interests', icon: Heart, value: 'Photography, Travel' },
                { type: 'Social Graph', icon: Users, value: '847 connections' },
                { type: 'Engagement', icon: MessageCircle, value: 'Likes memes' }
            ]
        }
    };

    const sites = [
        { name: 'news.com', color: '#4a9eff' },
        { name: 'shop.com', color: '#ff6b6b' },
        { name: 'social.com', color: '#a855f7' },
    ];

    // Auto-cycle: show unblocked, then blocked - SLOWER for comprehension (4000ms instead of 1500ms)
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
                    // After completing a cycle, pause then toggle blocked state
                    setTimeout(() => {
                        setBlocked((b) => !b);
                        setTrackerData([]);
                    }, 2000);
                }
                return next;
            });
        }, 4000);

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
            }, 1500);
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

    const currentSiteData = trackerDataTypes[sites[currentSite]?.name];

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

                {/* Third-party tracker explainer */}
                <div className="tracker-explainer">
                    <div className="tracker-explainer-header">
                        <AlertTriangle size={14} color={blocked ? '#00ff9d' : 'var(--accent)'} />
                        <span>{blocked ? 'Trackers Blocked' : 'What\'s happening?'}</span>
                    </div>
                    {!blocked ? (
                        <div className="tracker-explainer-content">
                            <p>
                                <strong>Third-party trackers</strong> are scripts from external companies
                                embedded in websites. They follow you across different sites.
                            </p>
                            {currentSiteData && (
                                <div className="tracker-company-list">
                                    <span className="tracker-company-label">Trackers on {sites[currentSite]?.name}:</span>
                                    <div className="tracker-company-tags">
                                        {currentSiteData.trackers.map(tracker => (
                                            <span key={tracker} className="tracker-company-tag">{tracker}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="tracker-explainer-content protected">
                            <p>
                                With a <strong>tracker blocker</strong> like uBlock Origin, these scripts
                                are blocked. The website still works, but trackers can't collect data.
                            </p>
                        </div>
                    )}
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

                    {/* Enhanced Tracker profile (only when not blocked) */}
                    <AnimatePresence>
                        {!blocked && trackerData.length > 0 && (
                            <motion.div
                                className="tracker-profile-enhanced"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="tracker-profile-header">
                                    <Eye size={14} color="var(--accent)" />
                                    <span>Your Profile (As Trackers See You)</span>
                                </div>
                                <div className="tracker-profile-categories">
                                    {trackerData.map((siteName, i) => {
                                        const siteData = trackerDataTypes[siteName];
                                        if (!siteData) return null;
                                        return (
                                            <motion.div
                                                key={siteName}
                                                className="tracker-profile-category"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.2 }}
                                            >
                                                <span className="tracker-category-source">{siteName}</span>
                                                <div className="tracker-data-points">
                                                    {siteData.dataCollected.map((data, j) => (
                                                        <motion.div
                                                            key={data.type}
                                                            className="tracker-data-point"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: i * 0.2 + j * 0.1 }}
                                                        >
                                                            <data.icon size={10} />
                                                            <span className="tracker-data-type">{data.type}:</span>
                                                            <span className="tracker-data-value">{data.value}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                                {trackerData.length > 1 && (
                                    <div className="tracker-profile-summary">
                                        <AlertTriangle size={12} color="var(--accent)" />
                                        <span>Cross-site tracking: {trackerData.length} sites linked</span>
                                    </div>
                                )}
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
                                <p className="tracker-blocked-message">No data collected. Your browsing stays private.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* What happens with this data - only show when exposed with full profile */}
                <AnimatePresence>
                    {!blocked && trackerData.length >= 2 && (
                        <motion.div
                            className="tracker-impact"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <h5>What happens with this data?</h5>
                            <ul className="tracker-impact-list">
                                <li><Target size={12} /> <span><strong>Targeted Ads:</strong> Laptop ads everywhere</span></li>
                                <li><DollarSign size={12} /> <span><strong>Price Changes:</strong> Some sites show higher prices</span></li>
                                <li><Database size={12} /> <span><strong>Data Brokers:</strong> Your profile sold to others</span></li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>

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
