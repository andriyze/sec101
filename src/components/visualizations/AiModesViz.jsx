import React from 'react'
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.*
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { User, Brain, MessageSquare, Search, FileText, Wrench, Send, RefreshCw } from 'lucide-react'
import VizContainer from './VizContainer'
import AnimationControls from './AnimationControls'
import StepCaption from './StepCaption'
import { useAnimationControl } from './useAnimationControl'
import { tArray } from '../../i18n/safeTranslate'

// Each lane is one kind of machine; `step` is when a node lights up, `range` when the lane is the focus.
const LANES = [
  {
    id: 'chat',
    range: [1, 1],
    nodes: [
      { id: 'you', icon: User, label: 'you', step: 0, text: 'question' },
      { id: 'model', icon: Brain, label: 'model', step: 1 },
      { id: 'answer', icon: MessageSquare, label: 'answer', step: 1, text: 'chat_answer', tag: 'chat_tag' },
    ],
  },
  {
    id: 'rag',
    range: [2, 3],
    nodes: [
      { id: 'you', icon: User, label: 'you', step: 0, text: 'question' },
      { id: 'search', icon: Search, label: 'search', step: 2 },
      { id: 'docs', icon: FileText, label: 'docs', step: 2, text: 'rag_hit' },
      { id: 'model', icon: Brain, label: 'model', step: 3 },
      { id: 'answer', icon: MessageSquare, label: 'answer', step: 3, text: 'rag_answer', tag: 'rag_tag' },
    ],
  },
  {
    id: 'agent',
    range: [4, 5],
    nodes: [
      { id: 'you', icon: User, label: 'you', step: 0, text: 'question' },
      { id: 'model', icon: Brain, label: 'model', step: 4 },
      {
        id: 'tools',
        icon: Wrench,
        label: 'tools',
        step: 4,
        loop: true,
        chips: [
          { key: 'agent_tool1', step: 4 },
          { key: 'agent_tool2', step: 5 },
        ],
      },
      { id: 'action', icon: Send, label: 'action', step: 5, text: 'agent_answer', tag: 'agent_tag' },
    ],
  },
]

const AiModesViz = () => {
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
  } = useAnimationControl({ totalSteps: 6, interval: 4500, loop: true })

  const k = key => t(`visualizations.ai_modes.${key}`)
  const laneState = lane => {
    if (currentStep === 0) return 'active'
    if (currentStep >= lane.range[0] && currentStep <= lane.range[1]) return 'active'
    return currentStep > lane.range[1] ? 'done' : 'idle'
  }

  return (
    <VizContainer ref={vizRef} title={k('title')}>
      <div className="aim-wrapper">
        {LANES.map(lane => {
          const state = laneState(lane)
          return (
            <div key={lane.id} className={`aim-lane ${lane.id} ${state}`}>
              <span className="aim-lane-label">{k(`lane_${lane.id}`)}</span>
              <div className="aim-track">
                {lane.nodes.map((node, i) => {
                  const lit = currentStep >= node.step
                  const Icon = node.icon
                  return (
                    <React.Fragment key={node.id}>
                      {i > 0 && (
                        <span className={`aim-arrow ${lit ? 'lit' : ''} ${node.loop ? 'loop' : ''}`}>
                          {node.loop ? (
                            <motion.span
                              className="aim-loop"
                              animate={lit && state === 'active' && !prefersReducedMotion ? { rotate: 360 } : { rotate: 0 }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                              <RefreshCw size={16} />
                            </motion.span>
                          ) : (
                            '→'
                          )}
                        </span>
                      )}
                      <motion.div
                        className={`aim-node ${lit ? 'lit' : ''}`}
                        initial={false}
                        animate={{ scale: lit ? 1 : 0.94, opacity: lit ? 1 : 0.38 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                      >
                        <Icon size={18} aria-hidden="true" />
                        <span className="aim-node-label">{k(node.label)}</span>
                        {node.text && lit && <span className="aim-node-text">{k(node.text)}</span>}
                        {node.chips && (
                          <span className="aim-chips">
                            {node.chips.map(chip => (
                              <span key={chip.key} className={`aim-chip ${currentStep >= chip.step ? 'lit' : ''}`}>
                                {k(chip.key)}
                              </span>
                            ))}
                          </span>
                        )}
                        {node.tag && lit && <span className="aim-node-tag">{k(node.tag)}</span>}
                      </motion.div>
                    </React.Fragment>
                  )
                })}
                {state === 'active' && currentStep > 0 && !prefersReducedMotion && (
                  <motion.span
                    key={`${lane.id}-${currentStep}`}
                    className="aim-dot"
                    initial={{ left: '2%', opacity: 0 }}
                    animate={{ left: ['2%', '98%'], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2.2, ease: 'linear', repeat: Infinity, repeatDelay: 0.6 }}
                  />
                )}
              </div>
            </div>
          )
        })}

        <StepCaption steps={tArray(t, 'visualizations.ai_modes.steps')} currentStep={currentStep} />

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

export default AiModesViz
