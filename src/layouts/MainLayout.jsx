import React, { useEffect, useRef, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Shield, ChevronRight, CheckCircle, Circle, RotateCcw, Github } from 'lucide-react';
import clsx from 'clsx';
import { useProgress } from '../hooks/useProgress';
import { QUIZ_UPDATED_EVENT, RESETTABLE_STORAGE_KEYS, STORAGE_RESET_EVENT } from '../storageKeys';

const MainLayout = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const { isTopicCompleted, resetProgress } = useProgress();
    const mainRef = useRef(null);
    const dialogRef = useRef(null);
    const cancelButtonRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
    );
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth < 1024 : false
    );
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ua' : 'en';
        i18n.changeLanguage(newLang);
    };

    const handleResetProgress = () => {
        setShowResetConfirm(true);
    };

    const confirmResetProgress = () => {
        resetProgress();
        RESETTABLE_STORAGE_KEYS.forEach((key) => {
            window.localStorage.removeItem(key);
        });
        window.dispatchEvent(new CustomEvent(QUIZ_UPDATED_EVENT));
        window.dispatchEvent(new CustomEvent(STORAGE_RESET_EVENT));
        setShowResetConfirm(false);
    };

    const navItems = [
        { path: '/', label: t('nav.home'), icon: Shield, isHome: true },
        { path: '/phishing', label: t('nav.phishing'), icon: ChevronRight, topicId: 'phishing' },
        { path: '/passwords', label: t('nav.passwords'), icon: ChevronRight, topicId: 'passwords' },
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

    const currentNav = navItems.find((item) => item.path === location.pathname);
    const currentPageLabel = currentNav && !currentNav.isHome ? currentNav.label : null;

    useEffect(() => {
        document.documentElement.lang = i18n.language === 'ua' ? 'uk' : 'en';
        document.title = currentPageLabel ? `${currentPageLabel} · ${t('app.title')}` : t('app.title');
    }, [currentPageLabel, i18n.language, t]);

    useEffect(() => {
        window.scrollTo(0, 0);

        const frame = window.requestAnimationFrame(() => {
            mainRef.current?.focus();
        });

        return () => window.cancelAnimationFrame(frame);
    }, [location.pathname]);

    useEffect(() => {
        if (!showResetConfirm) return undefined;

        const previouslyFocused = document.activeElement;
        cancelButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setShowResetConfirm(false);
                return;
            }
            if (event.key !== 'Tab') return;

            const focusables = dialogRef.current?.querySelectorAll('button');
            if (!focusables?.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (previouslyFocused instanceof HTMLElement) {
                previouslyFocused.focus();
            }
        };
    }, [showResetConfirm]);

    return (
        <div className="app-shell">
            <a className="skip-link" href="#main-content">{t('nav.skip_to_content')}</a>
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
            <main id="main-content" className="main-content" ref={mainRef} tabIndex={-1}>
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
            {showResetConfirm && (
                <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowResetConfirm(false)}>
                    <div
                        ref={dialogRef}
                        className="modal-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reset-dialog-title"
                        aria-describedby="reset-dialog-desc"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <h2 id="reset-dialog-title">{t('common.reset_progress')}</h2>
                        <p id="reset-dialog-desc">{t('common.reset_confirm')}</p>
                        <div className="modal-actions">
                            <button ref={cancelButtonRef} className="btn btn-glass" onClick={() => setShowResetConfirm(false)}>
                                {t('common.cancel')}
                            </button>
                            <button className="btn btn-primary" onClick={confirmResetProgress}>
                                {t('common.reset_confirm_button')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainLayout;
