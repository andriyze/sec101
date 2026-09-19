import React, { useId } from 'react'
// eslint-disable-next-line no-unused-vars -- motion is used in JSX as motion.*
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Monitor, Server, Globe, Database, Lightbulb } from 'lucide-react'
import VizContainer from './VizContainer'
import AnimationControls from './AnimationControls'
import { useAnimationControl } from './useAnimationControl'
import { useMediaQuery } from './useMediaQuery'

const NODE_RADIUS = 22
const LANE_OFFSET = 7
const QUESTION_COLOR = 'var(--primary)'
const ANSWER_COLOR = '#00ff9d'

// Hub-and-spoke map: the resolver sits in the middle and talks to every server itself.
const LAYOUTS = {
  wide: {
    viewBox: '0 0 640 322',
    nodes: {
      device: { x: 80, y: 160, label: 'below' },
      resolver: { x: 272, y: 160, label: 'below' },
      root: { x: 530, y: 58, label: 'below' },
      tld: { x: 530, y: 160, label: 'below' },
      auth: { x: 530, y: 262, label: 'below' },
    },
  },
  compact: {
    viewBox: '0 0 360 410',
    nodes: {
      device: { x: 180, y: 50, label: 'above' },
      resolver: { x: 180, y: 196, label: 'right' },
      root: { x: 62, y: 344, label: 'below' },
      tld: { x: 180, y: 344, label: 'below' },
      auth: { x: 298, y: 344, label: 'below' },
    },
  },
}

// Every message of a lookup, in order. `step` is the caption step it belongs to.
const ARROWS = [
  { n: 1, from: 'device', to: 'resolver', kind: 'q', step: 0 },
  { n: 2, from: 'resolver', to: 'root', kind: 'q', step: 1 },
  { n: 3, from: 'root', to: 'resolver', kind: 'a', step: 1 },
  { n: 4, from: 'resolver', to: 'tld', kind: 'q', step: 2 },
  { n: 5, from: 'tld', to: 'resolver', kind: 'a', step: 2 },
  { n: 6, from: 'resolver', to: 'auth', kind: 'q', step: 3 },
  { n: 7, from: 'auth', to: 'resolver', kind: 'a', step: 3 },
  { n: 8, from: 'resolver', to: 'device', kind: 'a', step: 4 },
]

/** Straight arrow between two node centres, trimmed to the node rings and shifted to its own lane. */
const arrowGeometry = (from, to) => {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy) || 1
  const ux = dx / length
  const uy = dy / length
  const nx = -uy
  const ny = ux
  const pad = NODE_RADIUS + 5
  const x1 = from.x + ux * pad + nx * LANE_OFFSET
  const y1 = from.y + uy * pad + ny * LANE_OFFSET
  const x2 = to.x - ux * (pad + 6) + nx * LANE_OFFSET
  const y2 = to.y - uy * (pad + 6) + ny * LANE_OFFSET
  return {
    x1,
    y1,
    x2,
    y2,
    badge: {
      x: x1 + (x2 - x1) * 0.38 + nx * 13,
      y: y1 + (y2 - y1) * 0.38 + ny * 13,
    },
  }
}

const labelAnchor = (node, placement) => {
  switch (placement) {
    case 'above':
      return { x: node.x, y: node.y - NODE_RADIUS - 10, anchor: 'middle' }
    case 'right':
      return { x: node.x + NODE_RADIUS + 10, y: node.y + 4, anchor: 'start' }
    default:
      return { x: node.x, y: node.y + NODE_RADIUS + 18, anchor: 'middle' }
  }
}

const DnsResolutionViz = () => {
  const { t } = useTranslation()
  const compact = useMediaQuery('(max-width: 640px)')
  const markerId = useId()

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
    totalSteps: 5,
    interval: 4200,
    loop: true,
  })

  const stepExplanations = [1, 2, 3, 4, 5].map(n => ({
    title: t(`visualizations.dns.steps.${n}.title`),
    description: t(`visualizations.dns.steps.${n}.short`),
    detail: t(`visualizations.dns.steps.${n}.detail`),
    serverRole: t(`visualizations.dns.steps.${n}.role`),
    packetLabel: t(`visualizations.dns.steps.${n}.packet`),
  }))

  const nodeMeta = {
    device: { icon: Monitor, label: t('visualizations.dns.your_device'), color: 'var(--primary)' },
    resolver: { icon: Server, label: t('visualizations.dns.resolver'), color: 'var(--secondary)' },
    root: { icon: Database, label: t('visualizations.dns.root'), color: '#ff6b6b' },
    tld: { icon: Database, label: t('visualizations.dns.tld'), color: '#ffa94d' },
    auth: { icon: Globe, label: t('visualizations.dns.auth'), color: ANSWER_COLOR },
  }

  const layout = compact ? LAYOUTS.compact : LAYOUTS.wide
  const arrows = ARROWS.map(arrow => ({
    ...arrow,
    ...arrowGeometry(layout.nodes[arrow.from], layout.nodes[arrow.to]),
  }))
  const activeArrows = arrows.filter(arrow => arrow.step === currentStep)
  const activeNodes = new Set(activeArrows.flatMap(arrow => [arrow.from, arrow.to]))
  const arrowState = arrow => {
    if (arrow.step === currentStep) return 'active'
    if (arrow.step < currentStep) return 'done'
    return 'idle'
  }

  // One travelling dot per step: out as a question (blue), back as an answer (green).
  const dotKeyframes = (() => {
    if (activeArrows.length === 0) return null
    const [first, second] = activeArrows
    if (!second) {
      const color = first.kind === 'q' ? QUESTION_COLOR : ANSWER_COLOR
      return {
        cx: [first.x1, first.x2],
        cy: [first.y1, first.y2],
        fill: [color, color],
        times: [0, 1],
        duration: 1.5,
      }
    }
    return {
      cx: [first.x1, first.x2, second.x1, second.x2],
      cy: [first.y1, first.y2, second.y1, second.y2],
      fill: [QUESTION_COLOR, QUESTION_COLOR, ANSWER_COLOR, ANSWER_COLOR],
      times: [0, 0.44, 0.52, 1],
      duration: 2.8,
    }
  })()

  const currentExplanation = stepExplanations[currentStep] || stepExplanations[0]
  const showingResponse = currentStep === 4
  const markers = {
    idle: `${markerId}-idle`,
    q: `${markerId}-q`,
    a: `${markerId}-a`,
  }

  return (
    <VizContainer
      ref={vizRef}
      title={t('visualizations.dns.title')}
      whyItMatters={t('visualizations.dns.why_matters')}
    >
      <div className="dns-viz-wrapper">
        {/* The question being answered */}
        <div className="dns-query-display">
          <span className="dns-query-text">
            {t('visualizations.dns.query')} <strong>google.com</strong>?
          </span>
          <AnimatePresence>
            {showingResponse && (
              <motion.span
                className="dns-response-text"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                {t('visualizations.dns.response')} <strong>142.250.185.78</strong>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Map of who talks to whom */}
        <svg
          className={`dns-map ${compact ? 'compact' : ''}`}
          viewBox={layout.viewBox}
          role="img"
          aria-label={`${t('visualizations.dns.step_of', { current: currentStep + 1, total: 5 })}: ${currentExplanation.title}`}
        >
          <defs>
            {[
              ['idle', 'var(--border-light)'],
              ['q', QUESTION_COLOR],
              ['a', ANSWER_COLOR],
            ].map(([key, color]) => (
              <marker
                key={key}
                id={markers[key]}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="8"
                markerHeight="8"
                markerUnits="userSpaceOnUse"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
              </marker>
            ))}
          </defs>

          {arrows.map(arrow => {
            const state = arrowState(arrow)
            const marker = state === 'idle' ? markers.idle : markers[arrow.kind]
            return (
              <g key={arrow.n} className={`dns-map-arrow ${arrow.kind} ${state}`}>
                <line
                  className="dns-map-link"
                  x1={arrow.x1}
                  y1={arrow.y1}
                  x2={arrow.x2}
                  y2={arrow.y2}
                  markerEnd={`url(#${marker})`}
                />
                <g className="dns-map-badge">
                  <circle cx={arrow.badge.x} cy={arrow.badge.y} r="8" />
                  <text x={arrow.badge.x} y={arrow.badge.y + 3} textAnchor="middle">
                    {arrow.n}
                  </text>
                </g>
              </g>
            )
          })}

          {dotKeyframes && !prefersReducedMotion && (
            <motion.circle
              key={currentStep}
              className="dns-map-dot"
              r="6"
              initial={{ cx: dotKeyframes.cx[0], cy: dotKeyframes.cy[0], fill: dotKeyframes.fill[0] }}
              animate={{ cx: dotKeyframes.cx, cy: dotKeyframes.cy, fill: dotKeyframes.fill }}
              transition={{
                duration: dotKeyframes.duration,
                times: dotKeyframes.times,
                ease: 'linear',
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            />
          )}

          {Object.entries(layout.nodes).map(([id, node]) => {
            const meta = nodeMeta[id]
            const label = labelAnchor(node, node.label)
            const Icon = meta.icon
            return (
              <g
                key={id}
                className={`dns-map-node ${activeNodes.has(id) ? 'active' : ''}`}
                style={{ '--node-color': meta.color }}
              >
                <circle className="dns-map-ring" cx={node.x} cy={node.y} r={NODE_RADIUS} />
                <Icon
                  x={node.x - 10}
                  y={node.y - 10}
                  width={20}
                  height={20}
                  color={meta.color}
                  aria-hidden="true"
                />
                <text x={label.x} y={label.y} textAnchor={label.anchor} className="dns-map-label">
                  {meta.label}
                </text>
                {id === 'resolver' && showingResponse && (
                  <g className="dns-map-cached">
                    <rect
                      x={node.x - 46}
                      y={node.y - NODE_RADIUS - 26}
                      width="92"
                      height="18"
                      rx="9"
                    />
                    <text x={node.x} y={node.y - NODE_RADIUS - 13} textAnchor="middle">
                      {t('visualizations.dns.cached')}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>

        <div className="dns-map-legend" aria-hidden="true">
          <span className="dns-map-legend-item">
            <i className="dns-map-swatch q" /> {t('visualizations.dns.legend_question')}
          </span>
          <span className="dns-map-legend-item">
            <i className="dns-map-swatch a" /> {t('visualizations.dns.legend_answer')}
          </span>
          <span className="dns-map-legend-note">{t('visualizations.dns.hub_note')}</span>
        </div>

        <div className="dns-packet-status" role="status">
          {currentExplanation.packetLabel}
        </div>

        {/* Step explanation */}
        <div className="dns-explanation-panel" aria-live={isPlaying ? 'off' : 'polite'} aria-atomic="true">
          <div className="dns-step-header">
            <span className="dns-step-number">
              {t('visualizations.dns.step_of', { current: currentStep + 1, total: 5 })}
            </span>
            <h4 className="dns-step-title">{currentExplanation.title}</h4>
          </div>
          <p className="dns-step-desc">{currentExplanation.description}</p>

          <AnimatePresence mode="wait">
            <motion.div
              className="dns-step-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              key={currentStep}
            >
              <p>{currentExplanation.detail}</p>
              <div className="dns-server-role">
                <Lightbulb size={14} />
                <span>{currentExplanation.serverRole}</span>
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
          playDisabled={prefersReducedMotion}
        />

        <details className="dns-technical">
          <summary>{t('visualizations.dns.technical_title')}</summary>
          <p>{t('visualizations.dns.technical_text')}</p>
        </details>
      </div>
    </VizContainer>
  )
}

export default DnsResolutionViz
