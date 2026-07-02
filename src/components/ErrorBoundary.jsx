import React from 'react';
import i18n from '../i18n/i18n';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Unhandled error in route:', error, info);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div role="alert" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', textAlign: 'center', padding: '2rem' }}>
                <h1 style={{ margin: 0 }}>{i18n.t('app.error_title')}</h1>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{i18n.t('app.error_desc')}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                    {i18n.t('app.error_reload')}
                </button>
            </div>
        );
    }
}

export default ErrorBoundary;
