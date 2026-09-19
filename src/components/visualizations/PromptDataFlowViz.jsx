import React, { useState } from 'react'
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.*
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Laptop, Cloud, Database, GraduationCap, Plug, Lock, EyeOff, FileText, X } from 'lucide-react'
import VizContainer from './VizContainer'
import AnimationControls from './AnimationControls'
import StepCaption from './StepCaption'
import { useAnimationControl } from './useAnimationControl'
import { tArray } from '../../i18n/safeTranslate'

/** One stop on the prompt's journey. */
const FlowNode = ({ icon, label, lit, current, off, children }) => (
  <motion.div
    className={`pf-node ${lit ? 'lit' : ''} ${off ? 'off' : ''} ${current ? 'current' : ''}`}
    initial={false}
    animate={{ opacity: lit ? 1 : 0.38 }}
  >
    {React.createElement(icon, { size: 20, 'aria-hidden': 'true' })}
    <span className="pf-node-label">{label}</span>
    {children}
  </motion.div>
)

const PromptDataFlowViz = () => {
  const { t } = useTranslation()
  const [trainingOn, setTrainingOn] = useState(true)
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
  } = useAnimationControl({ totalSteps: 5, interval: 4500, loop: true })

  const k = key => t(`visualizations.prompt_flow.${key}`)
  const lit = step => currentStep >= step
  const copy = (
    <span className="pf-copy">
      <FileText size={11} aria-hidden="true" /> {k('packet')}
    </span>
  )
  const nodeProps = (id, step, off = false) => ({
    label: k(id),
    lit: lit(step),
    current: currentStep === step,
    off,
  })

  return (
    <VizContainer ref={vizRef} title={k('title')}>
      <div className="pf-wrapper">
        <div className="pf-map">
          <FlowNode icon={Laptop} {...nodeProps('device', 0)}>
            {lit(0) && copy}
          </FlowNode>

          <div className={`pf-arrow ${lit(1) ? 'lit' : ''}`}>
            <span className="pf-arrow-line" />
            <span className="pf-arrow-badge">
              <Lock size={11} aria-hidden="true" /> {k('transit')}
            </span>
            {lit(1) && !prefersReducedMotion && (
              <motion.span
                className="pf-dot"
                animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.8, ease: 'linear' }}
              />
            )}
            <span className="pf-watcher">
              <EyeOff size={11} aria-hidden="true" /> {k('watcher')}
            </span>
          </div>

          <FlowNode icon={Cloud} {...nodeProps('provider', 1)}>
            {lit(1) && copy}
          </FlowNode>

          <div className={`pf-arrow ${lit(2) ? 'lit' : ''}`}>
            <span className="pf-arrow-line" />
          </div>

          <FlowNode icon={Database} {...nodeProps('logs', 2)}>
            {lit(2) && copy}
            {lit(2) && <span className="pf-note">{k('retention')}</span>}
          </FlowNode>

          <div className={`pf-arrow ${lit(3) && trainingOn ? 'lit' : ''} ${!trainingOn ? 'cut' : ''}`}>
            <span className="pf-arrow-line" />
            {!trainingOn && <X size={14} className="pf-cut" aria-hidden="true" />}
          </div>

          <FlowNode icon={GraduationCap} {...nodeProps('training', 3, !trainingOn)}>
            {lit(3) && trainingOn && copy}
            {lit(3) && !trainingOn && <span className="pf-note">{k('not_used')}</span>}
            <button
              type="button"
              className={`pf-toggle ${trainingOn ? 'on' : ''}`}
              onClick={() => setTrainingOn(v => !v)}
              aria-pressed={trainingOn}
            >
              <span className="pf-toggle-knob" />
              {trainingOn ? k('toggle_on') : k('toggle_off')}
            </button>
          </FlowNode>

          <div className={`pf-branch ${lit(4) ? 'lit' : ''}`}>
            <span className="pf-branch-line" />
            <FlowNode icon={Plug} {...nodeProps('tools', 4)}>
              {lit(4) && copy}
              {lit(4) && <span className="pf-note">{k('tools_note')}</span>}
            </FlowNode>
          </div>
        </div>

        <StepCaption steps={tArray(t, 'visualizations.prompt_flow.steps')} currentStep={currentStep} />

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

export default PromptDataFlowViz
