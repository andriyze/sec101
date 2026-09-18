import React from 'react'
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.*
import { motion, LayoutGroup } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Building2,
  Mail,
  Globe,
  Terminal,
  Lock,
  Server,
  User,
  ArrowRight,
  DoorOpen,
  DoorClosed,
} from 'lucide-react'
import VizContainer from './VizContainer'
import AnimationControls from './AnimationControls'
import StepCaption from './StepCaption'
import { useAnimationControl } from './useAnimationControl'
import { tArray } from '../../i18n/safeTranslate'

// Order matches visualizations.ports.steps
const PORTS = [
  { num: '80', icon: Globe, color: '#ff6b6b' },
  { num: '443', icon: Lock, color: '#00ff9d' },
  { num: '22', icon: Terminal, color: '#00f2ff' },
  { num: '25', icon: Mail, color: '#ffa94d' },
  { num: '53', icon: Server, color: '#7000ff' },
]

const PortsViz = () => {
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
    totalSteps: PORTS.length,
    interval: 4000,
    loop: true,
  })

  const activePort = currentStep
  const visitorTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 260, damping: 26 }

  return (
    <VizContainer
      ref={vizRef}
      title={t('visualizations.ports.title')}
      whyItMatters={t('visualizations.ports.why_matters')}
    >
      <div className="ports-viz-wrapper">
        <LayoutGroup id="ports-viz">
          <div className="ports-building">
            {/* Roof sign: one building, one address */}
            <div className="ports-building-roof">
              <Building2 size={18} color="var(--primary)" />
              <span className="ports-building-name">{t('visualizations.ports.building')}</span>
              <span className="ports-ip">{t('visualizations.ports.ip_address')}</span>
            </div>

            {/* One row per door; the visitor stands in front of the door being knocked on */}
            <div className="ports-rows">
              {PORTS.map((port, index) => {
                const active = index === activePort
                const Icon = port.icon
                return (
                  <div
                    key={port.num}
                    className={`ports-row ${active ? 'active' : ''}`}
                    style={{ '--port-color': port.color }}
                  >
                    <div className="ports-visitor-cell">
                      {active && (
                        <motion.div
                          layoutId="ports-visitor"
                          className="ports-visitor"
                          transition={visitorTransition}
                        >
                          <User size={15} aria-hidden="true" />
                          <span className="ports-visitor-word">{t('visualizations.ports.visitor')}</span>
                          <span className="ports-visitor-dest">:{port.num}</span>
                        </motion.div>
                      )}
                    </div>
                    <div className="ports-knock-cell" aria-hidden="true">
                      {active && (
                        <motion.span
                          className="ports-knock"
                          animate={prefersReducedMotion ? { x: 0 } : { x: [0, 7, 0] }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <ArrowRight size={18} />
                        </motion.span>
                      )}
                    </div>
                    <div className="ports-door">
                      <span className="ports-door-icon">
                        {active ? <DoorOpen size={22} /> : <DoorClosed size={22} />}
                      </span>
                      <span className="ports-apartment-num">:{port.num}</span>
                      <span className="ports-apartment-icon">
                        <Icon size={16} color={port.color} />
                      </span>
                      <div className="ports-apartment-info">
                        <span className="ports-service">
                          {t(`visualizations.ports.common.${port.num}.service`)}
                        </span>
                        <span className="ports-desc">
                          {t(`visualizations.ports.common.${port.num}.desc`)}
                        </span>
                      </div>
                      {active && (
                        <motion.span
                          className="ports-resident"
                          initial={prefersReducedMotion ? false : { scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          {t('visualizations.ports.resident')}
                        </motion.span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </LayoutGroup>

        <StepCaption steps={tArray(t, 'visualizations.ports.steps')} currentStep={currentStep} />

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

export default PortsViz
