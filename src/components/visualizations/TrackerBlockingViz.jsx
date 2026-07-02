import React, { useMemo } from 'react';
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.div
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    User, Globe, Eye, EyeOff, ShieldOff, ShieldCheck,
    FileText, Clock, MousePointer, ShoppingCart, DollarSign,
    XCircle, Heart, Users, MessageCircle, AlertTriangle, Target, Database
} from 'lucide-react';
import VizContainer from './VizContainer';
import AnimationControls from './AnimationControls';
import { useAnimationControl } from './useAnimationControl';
import { tArray } from '../../i18n/safeTranslate';

const TrackerBlockingViz = () => {
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
        totalSteps: 6,
        interval: 4000,
        loop: true,
        autoPlay: false
    });

    // Derive blocked and currentSite from step
    // Steps 0-2: unblocked (sites 0, 1, 2)
    // Steps 3-5: blocked (sites 0, 1, 2)
    const blocked = prefersReducedMotion ? true : currentStep >= 3;
    const currentSite = currentStep % 3;

    // Detailed tracker data per site - using i18n for data types
    const trackerDataTypes = {
        'news.com': {
            color: '#4a9eff',
            trackers: tArray(t, 'visualizations.tracker.sites.news.trackers', { defaultValue: ['Google Analytics', 'Facebook Pixel', 'Criteo'] }),
            dataCollected: [
                { type: t('visualizations.tracker.sites.news.data.articles.type', 'Articles Read'), icon: FileText, value: t('visualizations.tracker.sites.news.data.articles.value', 'Politics, Tech, Sports') },
                { type: t('visualizations.tracker.sites.news.data.time.type', 'Time Spent'), icon: Clock, value: t('visualizations.tracker.sites.news.data.time.value', '4 min on politics') },
                { type: t('visualizations.tracker.sites.news.data.scroll.type', 'Scroll Depth'), icon: MousePointer, value: t('visualizations.tracker.sites.news.data.scroll.value', '85% of article') }
            ]
        },
        'shop.com': {
            color: '#ff6b6b',
            trackers: tArray(t, 'visualizations.tracker.sites.shop.trackers', { defaultValue: ['Google Ads', 'Amazon', 'Pinterest'] }),
            dataCollected: [
                { type: t('visualizations.tracker.sites.shop.data.products.type', 'Products Viewed'), icon: ShoppingCart, value: t('visualizations.tracker.sites.shop.data.products.value', 'Laptop, Headphones') },
                { type: t('visualizations.tracker.sites.shop.data.price.type', 'Price Checks'), icon: DollarSign, value: t('visualizations.tracker.sites.shop.data.price.value', 'Compared 3 times') },
                { type: t('visualizations.tracker.sites.shop.data.cart.type', 'Cart Status'), icon: XCircle, value: t('visualizations.tracker.sites.shop.data.cart.value', 'Abandoned checkout') }
            ]
        },
        'social.com': {
            color: '#a855f7',
            trackers: tArray(t, 'visualizations.tracker.sites.social.trackers', { defaultValue: ['Meta Pixel', 'TikTok Analytics'] }),
            dataCollected: [
                { type: t('visualizations.tracker.sites.social.data.interests.type', 'Interests'), icon: Heart, value: t('visualizations.tracker.sites.social.data.interests.value', 'Photography, Travel') },
                { type: t('visualizations.tracker.sites.social.data.graph.type', 'Social Graph'), icon: Users, value: t('visualizations.tracker.sites.social.data.graph.value', '847 connections') },
                { type: t('visualizations.tracker.sites.social.data.engagement.type', 'Engagement'), icon: MessageCircle, value: t('visualizations.tracker.sites.social.data.engagement.value', 'Likes memes') }
            ]
        }
    };

    const sites = [
        { name: 'news.com', color: '#4a9eff' },
        { name: 'shop.com', color: '#ff6b6b' },
        { name: 'social.com', color: '#a855f7' },
    ];

    // Build tracker data based on current step (accumulate for unblocked states)
    const trackerData = useMemo(() => {
        if (blocked || prefersReducedMotion) return [];
        // Show accumulated sites up to current site index
        return sites.slice(0, currentSite + 1).map(s => s.name);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <VizContainer title={t('visualizations.tracker.title')}>
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
                        <span>{blocked ? t('visualizations.tracker.trackers_blocked') : t('visualizations.tracker.whats_happening')}</span>
                    </div>
                    {!blocked ? (
                        <div className="tracker-explainer-content">
                            <p>{t('visualizations.tracker.third_party_desc')}</p>
                            {currentSiteData && (
                                <div className="tracker-company-list">
                                    <span className="tracker-company-label">{t('visualizations.tracker.trackers_on', { site: sites[currentSite]?.name })}</span>
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
                            <p>{t('visualizations.tracker.blocker_desc')}</p>
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
                                    <span>{t('visualizations.tracker.profile_header')}</span>
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
                                        <span>{t('visualizations.tracker.cross_site', { count: trackerData.length })}</span>
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
                                <p className="tracker-blocked-message">{t('visualizations.tracker.blocked_message')}</p>
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
                            <h5>{t('visualizations.tracker.impact_title')}</h5>
                            <ul className="tracker-impact-list">
                                <li><Target size={12} /> <span><strong>{t('visualizations.tracker.impact_ads')}</strong> {t('visualizations.tracker.impact_ads_desc')}</span></li>
                                <li><DollarSign size={12} /> <span><strong>{t('visualizations.tracker.impact_prices')}</strong> {t('visualizations.tracker.impact_prices_desc')}</span></li>
                                <li><Database size={12} /> <span><strong>{t('visualizations.tracker.impact_brokers')}</strong> {t('visualizations.tracker.impact_brokers_desc')}</span></li>
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

export default TrackerBlockingViz;
