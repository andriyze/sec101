import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Shield, ChevronRight, CheckCircle, Circle, RotateCcw, Github } from 'lucide-react';
import clsx from 'clsx';
import { useProgress } from '../hooks/useProgress';

const MainLayout = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const { isTopicCompleted, resetProgress } = useProgress();
    const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
    );
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth < 1024 : false
    );

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ua' : 'en';
        i18n.changeLanguage(newLang);
    };

    const handleResetProgress = () => {
        if (window.confirm(t('common.reset_confirm', { defaultValue: 'Are you sure you want to reset all progress? This cannot be undone.' }))) {
            resetProgress();
            // Clear quiz scores
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('quiz-')) {
                    localStorage.removeItem(key);
                }
            });
            // Clear checklists
            localStorage.removeItem('devices-checklist');
            window.dispatchEvent(new CustomEvent('sec101:quiz-updated'));
        }
    };

    const navItems = [
        { path: '/', label: t('nav.home'), icon: Shield, isHome: true },
        { path: '/passwords', label: t('nav.passwords'), icon: ChevronRight, topicId: 'passwords' },
        { path: '/phishing', label: t('nav.phishing'), icon: ChevronRight, topicId: 'phishing' },
        { path: '/browsing', label: t('nav.browsing'), icon: ChevronRight, topicId: 'browsing' },
        { path: '/social', label: t('nav.social'), icon: ChevronRight, topicId: 'social' },
        { path: '/devices', label: t('nav.devices'), icon: ChevronRight, topicId: 'devices' },
        { path: '/tools', label: t('nav.tools'), icon: ChevronRight, topicId: 'tools' },
        { path: '/advanced', label: t('nav.advanced'), icon: ChevronRight, topicId: 'advanced' },
    ];

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) {
                setIsSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.documentElement.lang = i18n.language === 'ua' ? 'uk' : 'en';
        document.title = t('app.title');
    }, [i18n.language, t]);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const currentNav = navItems.find((item) => item.path === location.pathname);

    return (
        <div className="app-shell">
            {/* Sidebar */}
            <aside className={clsx("sidebar", isSidebarOpen ? "open" : "closed")} aria-label="Primary">
                <div className="sidebar-header">
                    {isSidebarOpen && <span style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>SEC101</span>}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="icon-btn"
                        aria-label={isSidebarOpen ? t('nav.close_menu', { defaultValue: 'Close menu' }) : t('nav.open_menu', { defaultValue: 'Open menu' })}
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="nav-list">
                    <ul>
                        {navItems.map((item) => {
                            const isCompleted = item.topicId && isTopicCompleted(item.topicId);
                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            clsx("nav-item", isActive && "active", isCompleted && "completed")
                                        }
                                        onClick={() => isMobile && setIsSidebarOpen(false)}
                                    >
                                        <div className="nav-icon">
                                            {item.isHome ? (
                                                <item.icon size={20} />
                                            ) : isCompleted ? (
                                                <CheckCircle size={20} color="#00ff9d" />
                                            ) : (
                                                <Circle size={20} style={{ opacity: 0.4 }} />
                                            )}
                                        </div>
                                        <span className="nav-label">{item.label}</span>
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
            {isMobile && isSidebarOpen && <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />}

            {/* Main Content */}
            <main className="main-content">
                <header className="topbar">
                    <div className="topbar-title">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="icon-btn"
                            aria-label={isSidebarOpen ? t('nav.close_menu', { defaultValue: 'Close menu' }) : t('nav.open_menu', { defaultValue: 'Open menu' })}
                        >
                            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                        <div className="topbar-breadcrumb">
                            <span>SEC101</span>
                            <span>/</span>
                            <span>{currentNav?.label || t('nav.home')}</span>
                        </div>
                    </div>

                    <div className="topbar-actions">
                        <button
                            onClick={handleResetProgress}
                            className="icon-btn"
                            title={t('common.reset_progress', { defaultValue: 'Reset Progress' })}
                            aria-label={t('common.reset_progress', { defaultValue: 'Reset Progress' })}
                        >
                            <RotateCcw size={18} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: i18n.language === 'en' ? 'var(--primary)' : 'var(--text-muted)' }}>EN</span>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={i18n.language === 'ua'}
                                    onChange={toggleLanguage}
                                    aria-label={t('nav.language_toggle', { defaultValue: 'Toggle language' })}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: i18n.language === 'ua' ? 'var(--primary)' : 'var(--text-muted)' }}>UA</span>
                        </div>
                    </div>
                </header>
                <div className="container">
                    <Outlet />
                    <footer style={{
                        marginTop: '3rem',
                        padding: '1.5rem 0',
                        borderTop: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem'
                    }}>
                        <a
                            href="https://a3sec.net"
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
                        >
                            a3sec.net
                        </a>
                        <span style={{ opacity: 0.5 }}>·</span>
                        <a
                            href="https://github.com/andriyze/sec101"
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }}
                            title="View on GitHub"
                            aria-label="View on GitHub"
                        >
                            <Github size={16} />
                            <span>GitHub</span>
                        </a>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
