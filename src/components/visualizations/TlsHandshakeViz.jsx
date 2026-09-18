import React from 'react'
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.*
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Monitor, Server, Lock, Key, IdCard, MessageCircle, Lightbulb } from 'lucide-react'
import VizContainer from './VizContainer'
import AnimationControls from './AnimationControls'
import { useAnimationControl } from './useAnimationControl'
import { tArray } from '../../i18n/safeTranslate'

// Each handshake message as one rung of a ladder diagram: who sends it and what it looks like.
const RUNGS = [
  { id: 'client_hello', direction: 'right', icon: MessageCircle, color: 'var(--primary)' },
  { id: 'server_hello', direction: 'left', icon: IdCard, color: 'var(--secondary)' },
  { id: 'key_exchange', direction: 'right', icon: Key, color: '#ffa94d' },
  { id: 'secure', direction: 'both', icon: Lock, color: '#00ff9d' },
]

const TlsHandshakeViz = () => {
  const { t } = useTranslation()

  const {
    vizRef,
    currentStep,
    isPlaying,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    togglePlay,
    prefersReducedMotion,
  } = useAnimationControl({
    totalSteps: 4,
    interval: 4500,
    loop: true,
  })

  const explanations = [1, 2, 3, 4].map(n => ({
    title: t(`visualizations.tls.steps.${n}.title`),
    shortDesc: t(`visualizations.tls.steps.${n}.short`),
    detail: t(`visualizations.tls.steps.${n}.detail`),
    whatsSent: tArray(t, `visualizations.tls.steps.${n}.sent`, { defaultValue: [] }),
    analogy: t(`visualizations.tls.steps.${n}.analogy`),
    label: t(`visualizations.tls.step${n}`),
  }))

  const current = explanations[currentStep]
  const isSecure = currentStep === 3
  const rungState = index => {
    if (index === currentStep) return 'active'
    return index < currentStep ? 'done' : 'upcoming'
  }
  const dotTravel = direction => (direction === 'left' ? ['100%', '0%'] : ['0%', '100%'])

  return (
    <VizContainer ref={vizRef} title={t('visualizations.tls.title')}>
      <div className="tls-viz-wrapper">
        {/* Ladder diagram: browser on the left, server on the right, one rung per message */}
        <div className={`tls-ladder ${isSecure ? 'secure' : ''}`}>
          <div className="tls-ladder-head">
            <div className="tls-endpoint browser">
              <Monitor size={26} color="var(--primary)" />
              <span>{t('visualizations.tls.browser')}</span>
            </div>
            <div className="tls-endpoint server">
              <Server size={26} color="var(--secondary)" />
              <span>{t('visualizations.tls.server')}</span>
            </div>
          </div>

          <div className="tls-ladder-rows">
            {RUNGS.map((rung, index) => {
              const state = rungState(index)
              const Icon = rung.icon
              return (
                <div
                  key={rung.id}
                  className={`tls-ladder-row ${rung.direction} ${state}`}
                  style={{ '--rung-color': rung.color }}
                >
                  <span className="tls-ladder-label">
                    <span className="tls-ladder-num">{index + 1}</span>
                    <Icon size={13} aria-hidden="true" />
                    {explanations[index].label}
                  </span>
                  <div className="tls-ladder-line">
                    <i className="tls-ladder-head-left" />
                    <i className="tls-ladder-head-right" />
                  </div>
                  {state === 'active' && !prefersReducedMotion && rung.direction !== 'both' && (
                    <motion.span
                      key={currentStep}
                      className="tls-ladder-dot"
                      initial={{ left: dotTravel(rung.direction)[0], opacity: 0 }}
                      animate={{ left: dotTravel(rung.direction), opacity: [0, 1, 1, 0] }}
                      transition={{
                        duration: 1.6,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        repeatDelay: 0.5,
                        opacity: { times: [0, 0.1, 0.9, 1] },
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>

          <AnimatePresence>
            {isSecure && (
              <motion.div
                className="tls-secure-tunnel"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Lock size={14} />
                <span>{t('visualizations.tls.secure')}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step explanation */}
        <div className="tls-explanation-panel" aria-live="polite" aria-atomic="true">
          <div className="tls-step-header">
            <span className="tls-step-number">
              {t('visualizations.tls.step_of', { current: currentStep + 1, total: 4 })}
            </span>
            <h4 className="tls-step-title">{current.title}</h4>
          </div>
          <p className="tls-step-desc">{current.shortDesc}</p>

          <AnimatePresence mode="wait">
            <motion.div
              className="tls-step-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              key={currentStep}
            >
              <p>{current.detail}</p>
              <div className="tls-whats-sent">
                {current.whatsSent.map(item => (
                  <span key={item} className="tls-sent-item">
                    {item}
                  </span>
                ))}
              </div>
              <div className="tls-analogy">
                <Lightbulb size={14} />
                <span>{current.analogy}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

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

        <div className="tls-why-matters">
          <p>
            <Lock size={12} style={{ display: 'inline', marginRight: '4px' }} />
            {t('visualizations.tls.why_matters')}
          </p>
        </div>

        <details className="dns-technical">
          <summary>{t('visualizations.tls.technical_title')}</summary>
          <p>{t('visualizations.tls.technical_text')}</p>
        </details>
      </div>
    </VizContainer>
  )
}

export default TlsHandshakeViz
