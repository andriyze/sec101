import React from 'react'
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.*
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Brain, Plug, FolderOpen, Calendar, Globe, User, ShieldQuestion, Eye } from 'lucide-react'
import VizContainer from './VizContainer'
import AnimationControls from './AnimationControls'
import StepCaption from './StepCaption'
import { useAnimationControl } from './useAnimationControl'
import { tArray } from '../../i18n/safeTranslate'

const SERVERS = [
  { id: 'files', icon: FolderOpen, tools: ['read_file', 'write_file'] },
  { id: 'calendar', icon: Calendar, tools: ['list_events', 'create_event'] },
  { id: 'a3sec', icon: Globe, tools: ['mortgage_quote', 'tax_estimate', 'average_mortgage_rates'], target: true },
]

const McpTopologyViz = () => {
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
  } = useAnimationControl({ totalSteps: 5, interval: 4500, loop: true })

  const k = key => t(`visualizations.mcp.${key}`)
  const discovering = currentStep === 0
  const calling = currentStep >= 4
  const pop = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 } }

  return (
    <VizContainer ref={vizRef} title={k('title')}>
      <div className="mcp-wrapper">
        <div className={`mcp-map ${discovering ? 'discovering' : ''} ${calling ? 'calling' : ''}`}>
          {/* Host application */}
          <div className="mcp-host">
            <span className="mcp-host-label">{k('host')}</span>
            <div className={`mcp-node model ${currentStep >= 2 ? 'lit' : ''}`}>
              <Brain size={18} aria-hidden="true" />
              <span>{k('model')}</span>
            </div>
            <div className="mcp-bubbles">
              <AnimatePresence initial={false}>
                {currentStep >= 1 && (
                  <motion.span key="user" className="mcp-bubble user" {...pop}>
                    <User size={12} aria-hidden="true" /> {k('user_prompt')}
                  </motion.span>
                )}
                {currentStep >= 2 && (
                  <motion.code key="call" className="mcp-call" {...pop}>
                    {k('tool_call')}
                  </motion.code>
                )}
                {currentStep === 3 && (
                  <motion.span key="dialog" className="mcp-dialog" {...pop}>
                    <span className="mcp-dialog-text">
                      <ShieldQuestion size={14} aria-hidden="true" /> {k('dialog')}
                    </span>
                    <span className="mcp-dialog-buttons" aria-hidden="true">
                      <span className="mcp-dialog-btn primary">{k('allow_once')}</span>
                      <span className="mcp-dialog-btn">{k('always')}</span>
                      <span className="mcp-dialog-btn">{k('deny')}</span>
                    </span>
                  </motion.span>
                )}
                {currentStep >= 4 && (
                  <motion.span key="answer" className="mcp-bubble answer" {...pop}>
                    {k('answer')}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className={`mcp-node client ${currentStep >= 2 || discovering ? 'lit' : ''}`}>
              <Plug size={18} aria-hidden="true" />
              <span>{k('client')}</span>
            </div>
          </div>

          {/* The shared plug */}
          <div className="mcp-bus" aria-hidden="true">
            <span className="mcp-bus-line" />
            {discovering && <span className="mcp-bus-label">{k('discover')}</span>}
          </div>

          {/* Servers */}
          <div className="mcp-servers">
            {SERVERS.map(server => {
              const Icon = server.icon
              const active = discovering || (server.target && currentStep >= 2)
              return (
                <div key={server.id} className={`mcp-server ${active ? 'lit' : ''} ${server.target && calling ? 'busy' : ''}`}>
                  <div className="mcp-server-head">
                    <Icon size={16} aria-hidden="true" />
                    <span className="mcp-server-name">{k(`server_${server.id}`)}</span>
                    <span className="mcp-server-backend">→ {k(`backend_${server.id}`)}</span>
                  </div>
                  <div className="mcp-tools">
                    {server.tools.map((tool, i) => (
                      <motion.code
                        key={tool}
                        className={`mcp-tool ${server.target && tool === 'mortgage_quote' && currentStep >= 2 ? 'chosen' : ''}`}
                        initial={false}
                        animate={{ opacity: 1 }}
                        transition={{ delay: discovering && !prefersReducedMotion ? 0.3 + i * 0.15 : 0 }}
                      >
                        {tool}
                      </motion.code>
                    ))}
                  </div>
                  <AnimatePresence initial={false}>
                    {server.target && calling && (
                      <motion.div key="work" className="mcp-server-work" {...pop}>
                        <span className="mcp-sees">
                          <Eye size={11} aria-hidden="true" /> {k('sees')}
                        </span>
                        <span className="mcp-result">{k('result')}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        <StepCaption steps={tArray(t, 'visualizations.mcp.steps')} currentStep={currentStep} isPlaying={isPlaying} />

        <AnimationControls
          currentStep={currentStep}
          totalSteps={totalSteps}
          isPlaying={isPlaying}
          onPrev={prevStep}
          onNext={nextStep}
          onGoToStep={goToStep}
          onTogglePlay={togglePlay}
          playDisabled={prefersReducedMotion}
        />
      </div>
    </VizContainer>
  )
}

export default McpTopologyViz
