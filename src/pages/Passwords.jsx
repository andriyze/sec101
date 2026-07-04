import React from 'react'
import { useTranslation } from 'react-i18next'
import Card from '../components/Card'
import {
  KeyRound,
  ShieldCheck,
  Lock,
  Smartphone,
  Fingerprint,
  Key,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react'
import Quiz from '../components/Quiz'
import TopicCompletionCard from '../components/TopicCompletionCard'
import MfaFactorsViz from '../components/visualizations/MfaFactorsViz'
import { tArray } from '../i18n/safeTranslate'

const Passwords = () => {
  const { t } = useTranslation()
  const quizQuestions = tArray(t, 'passwords.quiz.questions')

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div className="section-title">
          <KeyRound color="var(--primary)" size={40} />
          <h2 style={{ margin: 0 }}>{t('passwords.title')}</h2>
        </div>
        <p className="section-subtitle">{t('passwords.subtitle')}</p>
      </div>

      {/* Quick wins */}
      <section className="section">
        <div className="alert alert-info">
          <ShieldCheck size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
          <div className="alert-content">
            <h3>{t('passwords.quick.title')}</h3>
            <ul className="list-clean" style={{ marginTop: '0.5rem' }}>
              {tArray(t, 'passwords.quick.actions').map((item, i) => (
                <li key={i} style={{ marginBottom: '0.35rem' }}>
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 1. Password Manager */}
      <section className="section">
        <div className="section-header">
          <div className="section-title">
            <Key size={24} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>{t('passwords.why_manager.title')}</h3>
          </div>
          <p className="section-subtitle">{t('passwords.why_manager.desc')}</p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="card card-recommended">
            <span className="recommended-badge">{t('common.recommended')}</span>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div className="icon-box" aria-hidden="true">
                🛡️
              </div>
              <h3 style={{ margin: '0 0 0 1rem' }}>Bitwarden</h3>
            </div>
            <p>{t('passwords.managers.bitwarden.desc')}</p>
            <a
              href="https://bitwarden.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginTop: '1rem',
                fontWeight: 600,
              }}
            >
              {t('common.get')} Bitwarden <span style={{ marginLeft: '5px' }}>→</span>
            </a>
          </div>
          <Card
            title="Proton Pass"
            icon="🟣"
            description={t('passwords.managers.proton.desc')}
            link="https://proton.me/pass"
            linkText={t('common.get') + ' Proton Pass'}
          />
          <Card
            title="Google Password Manager"
            icon="🔑"
            description={t('passwords.managers.google.desc')}
          />
          <Card title="Apple Keychain" icon="🍎" description={t('passwords.managers.apple.desc')} />
        </div>

        <div className="grid grid-cols-2 gap-6" style={{ marginTop: '1.5rem' }}>
          <div className="card panel-solid">
            <div className="badge-grid" style={{ marginBottom: '0.75rem' }}>
              <span className="pill pill-success">{t('passwords.bitwarden_setup.time')}</span>
              <span className="pill">{t('passwords.bitwarden_setup.device')}</span>
            </div>
            <h4 style={{ marginBottom: '0.75rem' }}>{t('passwords.bitwarden_setup.title')}</h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
                  {t('passwords.bitwarden_setup.desktop.title')}
                </h5>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {tArray(t, 'passwords.bitwarden_setup.desktop.steps').map((step, i) => (
                    <li key={i} style={{ marginBottom: '0.4rem' }}>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
                  {t('passwords.bitwarden_setup.mobile.title')}
                </h5>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {tArray(t, 'passwords.bitwarden_setup.mobile.steps').map((step, i) => (
                    <li key={i} style={{ marginBottom: '0.4rem' }}>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="card panel-solid">
            <h4
              style={{
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertTriangle size={18} color="var(--accent)" /> {t('passwords.recovery.title')}
            </h4>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {tArray(t, 'passwords.recovery.items').map((item, i) => (
                <li key={i} style={{ marginBottom: '0.4rem' }}>
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>{t('passwords.recovery.note')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6" style={{ marginTop: '1.5rem' }}>
          <div className="card">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="var(--danger)" /> {t('passwords.bad_passwords.title')}
            </h4>
            <p>{t('passwords.bad_passwords.desc')}</p>
            <div className="badge-grid">
              {tArray(t, 'passwords.bad_passwords.examples').map(pw => (
                <span key={pw} className="pill pill-accent" style={{ fontFamily: 'monospace' }}>
                  {pw}
                </span>
              ))}
            </div>
          </div>
          <div className="card">
            <h4>{t('passwords.good_passwords.title')}</h4>
            <p>{t('passwords.good_passwords.desc')}</p>
            <div className="badge-grid">
              {tArray(t, 'passwords.good_passwords.examples').map(pw => (
                <span key={pw} className="pill pill-success" style={{ fontFamily: 'monospace' }}>
                  {pw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data breaches */}
      <section className="section">
        <div className="section-header">
          <div className="section-title">
            <ShieldAlert size={24} color="var(--accent)" />
            <h3 style={{ margin: 0 }}>{t('passwords.breaches.title')}</h3>
          </div>
          <p className="section-subtitle">{t('passwords.breaches.intro')}</p>
        </div>

        <div className="card panel-solid">
          <ol style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {tArray(t, 'passwords.breaches.items').map((item, i) => (
              <li key={i} style={{ marginBottom: '0.35rem' }}>
                {item}
              </li>
            ))}
          </ol>
          <a
            className="btn btn-primary"
            href="https://haveibeenpwned.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', textDecoration: 'none' }}
          >
            <ShieldAlert size={18} />
            {t('passwords.breaches.hibp_label')}
          </a>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.75rem', marginBottom: 0 }}>
            {t('passwords.breaches.manager_note')}
          </p>
        </div>

        <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
          <ShieldCheck size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
          <p style={{ margin: 0 }}>{t('passwords.breaches.not_your_fault')}</p>
        </div>
      </section>

      {/* 2. MFA */}
      <section className="section">
        <div className="section-header">
          <div className="section-title">
            <Smartphone size={24} color="var(--secondary)" />
            <h3 style={{ margin: 0 }}>{t('passwords.mfa.title')}</h3>
          </div>
          <p className="section-subtitle">{t('passwords.mfa.intro')}</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div className="pill">{t('passwords.mfa.subtitle')}</div>
          <div className="pill pill-success">{t('passwords.mfa.time')}</div>
          <div className="pill pill-accent">{t('passwords.mfa.backup')}</div>
        </div>

        {/* MFA Visualization */}
        <MfaFactorsViz />

        <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '2rem' }}>
          <div className="card card-recommended">
            <span className="recommended-badge">{t('common.recommended')}</span>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div className="icon-box" aria-hidden="true">
                📱
              </div>
              <h3 style={{ margin: '0 0 0 1rem' }}>{t('passwords.mfa.methods.apps.title')}</h3>
            </div>
            <p>{t('passwords.mfa.methods.apps.desc')}</p>
          </div>
          <Card
            title={t('passwords.mfa.methods.hardware.title')}
            icon="🗝️"
            description={t('passwords.mfa.methods.hardware.desc')}
          />
          <Card
            title={t('passwords.mfa.methods.biometrics.title')}
            icon="👁️"
            description={t('passwords.mfa.methods.biometrics.desc')}
          />
          <div
            className="card"
            style={{ borderColor: 'var(--danger)', background: 'rgba(255, 59, 48, 0.05)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="icon-box" aria-hidden="true">
                📩
              </div>
              <h3 style={{ margin: '0 0 0 1rem', color: 'var(--danger)' }}>
                {t('passwords.mfa.methods.sms.title')}
              </h3>
            </div>
            <p>{t('passwords.mfa.methods.sms.desc')}</p>
          </div>
        </div>

        {/* Recommended Authenticator App */}
        <div className="card card-recommended" style={{ marginBottom: '2rem' }}>
          <span className="recommended-badge">{t('passwords.mfa.app_recommendation.badge')}</span>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div className="icon-box" aria-hidden="true">
              🔐
            </div>
            <h3 style={{ margin: '0 0 0 1rem' }}>2FAS</h3>
          </div>
          <p>{t('passwords.mfa.app_recommendation.desc')}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <a
              href="https://2fas.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 600 }}
            >
              {t('common.get')} 2FAS <span style={{ marginLeft: '5px' }}>→</span>
            </a>
          </div>
        </div>

        <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
          <ShieldCheck size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
          <div className="alert-content">
            <h3>{t('passwords.mfa.bitwarden_advanced.title')}</h3>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                {t('passwords.mfa.bitwarden_advanced.otp')}
              </li>
              <li>{t('passwords.mfa.bitwarden_advanced.passkeys')}</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '1.5rem' }}>
          <div className="card panel-solid">
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>
              {t('passwords.mfa.gmail.title')}
            </h4>
            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.95rem' }}>
              {tArray(t, 'passwords.mfa.gmail.steps').map((step, i) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="card panel-solid">
            <h4 style={{ color: 'var(--secondary)', marginBottom: '0.75rem' }}>
              {t('passwords.mfa.proton.title')}
            </h4>
            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.95rem' }}>
              {tArray(t, 'passwords.mfa.proton.steps').map((step, i) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="card panel-solid" style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.75rem' }}>{t('passwords.mfa.platform_2fa.title')}</h4>
          <div className="grid grid-cols-3 gap-6">
            {tArray(t, 'passwords.mfa.platform_2fa.items').map(item => (
              <div key={item.title} className="card">
                <h5 style={{ marginBottom: '0.5rem' }}>{item.title}</h5>
                <p style={{ margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card panel-solid">
          <h4>{t('passwords.mfa.quick_actions.title')}</h4>
          <ul className="list-clean" style={{ marginTop: '0.75rem' }}>
            {tArray(t, 'passwords.mfa.quick_actions.items').map((item, i) => (
              <li key={i} style={{ marginBottom: '0.4rem' }}>
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Passkeys */}
      <section className="section">
        <div className="section-header">
          <div className="section-title">
            <Fingerprint size={24} color="var(--accent)" />
            <h3 style={{ margin: 0 }}>{t('passwords.passkeys.title')}</h3>
          </div>
          <p className="section-subtitle">{t('passwords.passkeys.desc')}</p>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <p style={{ marginBottom: '1rem' }}>{t('passwords.passkeys.setup')}</p>
          <ul style={{ paddingLeft: '1.25rem' }}>
            {tArray(t, 'passwords.passkeys.notes').map((item, i) => (
              <li key={i} style={{ marginBottom: '0.4rem' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <Quiz
          title={t('passwords.quiz.title')}
          questions={quizQuestions}
          storageKey="quiz-passwords"
        />
      </section>

      <TopicCompletionCard topicId="passwords" quizStorageKey="quiz-passwords" />
    </div>
  )
}

export default Passwords
