import React, { useState } from 'react'
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.*
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Lock, Unlock, Check, X, Zap, Laptop, Globe } from 'lucide-react'
import VizContainer from './VizContainer'
import AnimationControls from './AnimationControls'
import StepCaption from './StepCaption'
import { useAnimationControl } from './useAnimationControl'
import { tArray } from '../../i18n/safeTranslate'

const TRACK_START = '6%'
const TRACK_END = '94%'

/** A packet gliding from sender to receiver, restarting forever. */
const TravellingPacket = ({ className, children, delay = 0, duration = 2.4, still, vanishAt }) => {
  if (still) {
    return (
      <div className={`protocols-packet ${className}`} style={{ left: '50%' }}>
        {children}
      </div>
    )
  }
  const opacity = vanishAt ? [0, 1, 1, 0, 0] : [0, 1, 1, 0]
  const times = vanishAt ? [0, 0.08, vanishAt - 0.05, vanishAt + 0.08, 1] : [0, 0.08, 0.92, 1]
  return (
    <motion.div
      className={`protocols-packet ${className}`}
      initial={{ left: TRACK_START, opacity: 0 }}
      animate={{ left: [TRACK_START, TRACK_END], opacity }}
      transition={{
        duration,
        delay,
        ease: 'linear',
        repeat: Infinity,
        repeatDelay: 0.8,
        opacity: { times, duration, delay, repeat: Infinity, repeatDelay: 0.8 },
      }}
    >
      {children}
    </motion.div>
  )
}

/** Sender or receiver box at either end of a lane. */
const Endpoint = ({ icon, label, children, side }) => (
  <div className={`protocols-endpoint ${side}`}>
    {React.createElement(icon, { size: 20, 'aria-hidden': 'true' })}
    <span className="protocols-endpoint-label">{label}</span>
    {children}
  </div>
)

const ProtocolsViz = () => {
  const { t } = useTranslation()
  const [comparison, setComparison] = useState('http') // 'http' or 'tcp'

  const {
    vizRef,
    currentStep,
    isPlaying,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    togglePlay,
    reset,
    prefersReducedMotion,
  } = useAnimationControl({
    totalSteps: 4,
    interval: 4000,
    loop: true,
  })

  const handleComparisonChange = newComparison => {
    setComparison(newComparison)
    reset()
  }

  const still = prefersReducedMotion
  const web = comparison === 'http'
  // Which lane the current step talks about
  const httpFocus = web && currentStep <= 1
  const httpsFocus = web && currentStep >= 2
  const tcpFocus = !web && currentStep <= 1
  const udpFocus = !web && currentStep >= 2
  const watcherReading = web && currentStep === 1
  const padlockShown = web && currentStep === 3
  const tcpDelivered = !web && currentStep >= 1
  const udpLoss = !web && currentStep >= 3

  return (
    <VizContainer
      ref={vizRef}
      title={t('visualizations.protocols.title')}
      whyItMatters={t('visualizations.protocols.why_matters')}
    >
      <div className="protocols-viz-wrapper">
        <div className="protocols-toggle" role="tablist">
          <button
            role="tab"
            aria-selected={web}
            className={`protocols-toggle-btn ${web ? 'active' : ''}`}
            onClick={() => handleComparisonChange('http')}
          >
            {t('visualizations.protocols.toggle_web')}
          </button>
          <button
            role="tab"
            aria-selected={!web}
            className={`protocols-toggle-btn ${!web ? 'active' : ''}`}
            onClick={() => handleComparisonChange('tcp')}
          >
            {t('visualizations.protocols.toggle_transport')}
          </button>
        </div>

        {web ? (
          <div className="protocols-comparison">
            {/* HTTP: the postcard, readable by whoever carries it */}
            <div className={`protocols-lane http ${httpFocus ? 'active' : ''}`}>
              <div className="protocols-lane-header">
                <Unlock size={16} />
                <span>{t('visualizations.protocols.http_label')}</span>
              </div>
              <div className="protocols-path">
                <Endpoint icon={Laptop} label={t('visualizations.protocols.you')} side="sender" />
                <div className="protocols-lane-track">
                  <div className="protocols-track-line" />
                  <TravellingPacket className="plain" still={still}>
                    {t('visualizations.protocols.message')}
                  </TravellingPacket>
                  <div className={`protocols-watcher ${watcherReading ? 'reading' : ''}`}>
                    <Eye size={16} aria-hidden="true" />
                    <span className="protocols-watcher-bubble">
                      “{t('visualizations.protocols.message')}”
                    </span>
                    <span className="protocols-watcher-label">
                      {t('visualizations.protocols.visible')}
                    </span>
                  </div>
                </div>
                <Endpoint icon={Globe} label={t('visualizations.protocols.website')} side="receiver" />
              </div>
            </div>

            {/* HTTPS: same message, sealed */}
            <div className={`protocols-lane https ${httpsFocus ? 'active' : ''}`}>
              <div className="protocols-lane-header">
                <Lock size={16} />
                <span>{t('visualizations.protocols.https_label')}</span>
              </div>
              <div className="protocols-path">
                <Endpoint icon={Laptop} label={t('visualizations.protocols.you')} side="sender" />
                <div className="protocols-lane-track">
                  <div className="protocols-track-line sealed" />
                  <TravellingPacket className="encrypted" still={still}>
                    <Lock size={12} aria-hidden="true" />
                    <span>•••••</span>
                  </TravellingPacket>
                  <div className="protocols-watcher safe">
                    <EyeOff size={16} aria-hidden="true" />
                    <span className="protocols-watcher-bubble">?????</span>
                    <span className="protocols-watcher-label">
                      {t('visualizations.protocols.encrypted')}
                    </span>
                  </div>
                </div>
                <Endpoint icon={Globe} label={t('visualizations.protocols.website')} side="receiver">
                  <motion.span
                    className="protocols-padlock"
                    initial={false}
                    animate={{ opacity: padlockShown ? 1 : 0, scale: padlockShown ? 1 : 0.6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    aria-hidden={!padlockShown}
                  >
                    <Lock size={11} /> https
                  </motion.span>
                </Endpoint>
              </div>
            </div>
          </div>
        ) : (
          <div className="protocols-comparison">
            {/* TCP: numbered, acknowledged, re-sent if lost */}
            <div className={`protocols-lane tcp ${tcpFocus ? 'active' : ''}`}>
              <div className="protocols-lane-header">
                <Check size={16} />
                <span>{t('visualizations.protocols.tcp_label')}</span>
              </div>
              <div className="protocols-path">
                <Endpoint icon={Laptop} label={t('visualizations.protocols.you')} side="sender" />
                <div className="protocols-lane-track">
                  <div className="protocols-track-line" />
                  {[1, 2, 3].map(num => (
                    <TravellingPacket
                      key={num}
                      className="tcp-packet"
                      still={still}
                      delay={(num - 1) * 0.9}
                      duration={3}
                    >
                      {num}
                    </TravellingPacket>
                  ))}
                  <span className="protocols-trait">
                    <Check size={11} aria-hidden="true" /> {t('visualizations.protocols.reliable')}
                  </span>
                </div>
                <Endpoint icon={Globe} label={t('visualizations.protocols.website')} side="receiver">
                  <span className="protocols-received" aria-label={t('visualizations.protocols.received')}>
                    {[1, 2, 3].map(num => (
                      <span key={num} className={`protocols-slot ${tcpDelivered ? 'filled' : ''}`}>
                        {tcpDelivered ? num : ''}
                      </span>
                    ))}
                  </span>
                </Endpoint>
              </div>
            </div>

            {/* UDP: fire and forget */}
            <div className={`protocols-lane udp ${udpFocus ? 'active' : ''}`}>
              <div className="protocols-lane-header">
                <Zap size={16} />
                <span>{t('visualizations.protocols.udp_label')}</span>
              </div>
              <div className="protocols-path">
                <Endpoint icon={Laptop} label={t('visualizations.protocols.you')} side="sender" />
                <div className="protocols-lane-track">
                  <div className="protocols-track-line" />
                  {[1, 2, 3].map(num => (
                    <TravellingPacket
                      key={`${num}-${udpLoss}`}
                      className={`udp-packet ${udpLoss && num === 2 ? 'lost' : ''}`}
                      still={still}
                      delay={(num - 1) * 0.45}
                      duration={1.6}
                      vanishAt={udpLoss && num === 2 ? 0.5 : undefined}
                    >
                      {udpLoss && num === 2 ? <X size={12} aria-hidden="true" /> : num}
                    </TravellingPacket>
                  ))}
                  <span className="protocols-trait">
                    <Zap size={11} aria-hidden="true" /> {t('visualizations.protocols.fast')}
                  </span>
                </div>
                <Endpoint icon={Globe} label={t('visualizations.protocols.website')} side="receiver">
                  <span className="protocols-received" aria-label={t('visualizations.protocols.received')}>
                    {[1, 2, 3].map(num => {
                      const missing = udpLoss && num === 2
                      const filled = udpFocus && !missing
                      return (
                        <span
                          key={num}
                          className={`protocols-slot ${filled ? 'filled' : ''} ${missing ? 'missing' : ''}`}
                        >
                          {filled ? num : ''}
                        </span>
                      )
                    })}
                  </span>
                </Endpoint>
              </div>
            </div>
          </div>
        )}

        <StepCaption
          steps={tArray(
            t,
            web ? 'visualizations.protocols.steps_web' : 'visualizations.protocols.steps_transport'
          )}
          currentStep={currentStep}
        />

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
  )
}

export default ProtocolsViz
