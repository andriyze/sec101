import React, { useState } from 'react'
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.*
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { User, Bot, Wrench, Lock, Mail, EyeOff, ShieldAlert, ShieldCheck, Unlink } from 'lucide-react'
import VizContainer from './VizContainer'
import AnimationControls from './AnimationControls'
import StepCaption from './StepCaption'
import { useAnimationControl } from './useAnimationControl'
import { tArray } from '../../i18n/safeTranslate'

const ROLE_ICON = { user: User, agent: Bot, tool: Wrench }

const PromptInjectionViz = () => {
  const { t } = useTranslation()
  const [mode, setMode] = useState('naive')
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
  } = useAnimationControl({ totalSteps: 6, interval: 5000, loop: true })

  const k = key => t(`visualizations.injection.${key}`)
  const guarded = mode === 'guarded'
  const m = key => k(`${mode}.${key}`)

  const switchMode = next => {
    setMode(next)
    reset()
  }

  // The agent's log, one entry per step. Entries 3-4 are where the two agents differ.
  const turns = [
    { step: 0, role: 'user', text: k('user_prompt') },
    { step: 1, role: 'tool', label: 'fetch_page', text: k('page_visible'), hidden: k('page_hidden') },
    { step: 2, role: 'agent', text: m('thought'), kind: guarded ? 'safe' : 'danger' },
    {
      step: 3,
      role: 'tool',
      label: 'read_inbox',
      text: m('inbox'),
      kind: guarded ? 'locked' : 'danger',
    },
    {
      step: 4,
      role: 'tool',
      label: 'send_email',
      text: guarded ? m('dialog') : m('send'),
      kind: guarded ? 'dialog' : 'alarm',
    },
    { step: 5, role: 'agent', text: m('final'), tag: m('final_tag'), kind: guarded ? 'safe' : 'quiet' },
  ]

  const ingredients = [
    { id: 'data', icon: Lock, from: 3, cut: guarded },
    { id: 'content', icon: EyeOff, from: 1, cut: false },
    { id: 'exit', icon: Mail, from: 4, cut: guarded },
  ]

  return (
    <VizContainer ref={vizRef} title={k('title')}>
      <div className="pi-wrapper">
        <div className="protocols-toggle" role="tablist">
          <button
            role="tab"
            aria-selected={!guarded}
            className={`protocols-toggle-btn ${!guarded ? 'active' : ''}`}
            onClick={() => switchMode('naive')}
          >
            <ShieldAlert size={14} aria-hidden="true" /> {k('mode_naive')}
          </button>
          <button
            role="tab"
            aria-selected={guarded}
            className={`protocols-toggle-btn ${guarded ? 'active' : ''}`}
            onClick={() => switchMode('guarded')}
          >
            <ShieldCheck size={14} aria-hidden="true" /> {k('mode_guarded')}
          </button>
        </div>

        <div className={`pi-transcript ${guarded ? 'guarded' : 'naive'}`} aria-live="polite">
          <AnimatePresence initial={false}>
            {turns
              .filter(turn => turn.step <= currentStep)
              .map(turn => {
                const Icon = ROLE_ICON[turn.role]
                return (
                  <motion.div
                    key={`${mode}-${turn.step}`}
                    className={`pi-turn ${turn.role} ${turn.kind || ''} ${turn.step === currentStep ? 'current' : ''}`}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className="pi-role">
                      <Icon size={14} aria-hidden="true" />
                      {k(`role_${turn.role}`)}
                      {turn.label && <code className="pi-tool-name">{turn.label}</code>}
                    </span>
                    <span className="pi-text">
                      {turn.kind === 'locked' && <Unlink size={13} aria-hidden="true" />}
                      {turn.text}
                    </span>
                    {turn.hidden && <span className="pi-hidden">{turn.hidden}</span>}
                    {turn.kind === 'dialog' && (
                      <span className="pi-dialog" aria-hidden="true">
                        <span className="pi-dialog-btn">{k('guarded.allow')}</span>
                        <span className="pi-dialog-btn deny">{k('guarded.deny')}</span>
                      </span>
                    )}
                    {turn.tag && <span className="pi-tag">{turn.tag}</span>}
                  </motion.div>
                )
              })}
          </AnimatePresence>
        </div>

        <div className="pi-trifecta" aria-label={k('trifecta_label')}>
          {ingredients.map(item => {
            const Icon = item.icon
            const involved = currentStep >= item.from
            const state = !involved ? 'idle' : item.cut ? 'cut' : 'lit'
            return (
              <span key={item.id} className={`pi-ingredient ${state}`}>
                <Icon size={13} aria-hidden="true" />
                {k(`trifecta.${item.id}`)}
                {state === 'cut' && <span className="pi-ingredient-mark">✕</span>}
                {state === 'lit' && <span className="pi-ingredient-mark">!</span>}
              </span>
            )
          })}
        </div>

        <StepCaption
          steps={tArray(t, `visualizations.injection.steps_${mode}`)}
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

export default PromptInjectionViz
