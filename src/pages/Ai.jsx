import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Bot,
  Lightbulb,
  MessageSquareWarning,
  ShieldCheck,
  Cpu,
  Plug,
  Bug,
  Route,
  ClipboardCheck,
  AlertTriangle,
} from 'lucide-react'
import Quiz from '../components/Quiz'
import TopicCompletionCard from '../components/TopicCompletionCard'
import PersistedChecklist from '../components/PersistedChecklist'
import { AI_CHECKLIST_STORAGE_KEY, AI_AGENT_CHECKLIST_STORAGE_KEY } from '../storageKeys'
import { tArray } from '../i18n/safeTranslate'

const SectionTitle = ({ icon, color, children }) => (
  <div className="section-title" style={{ marginBottom: '0.5rem' }}>
    {React.createElement(icon, { size: 24, color })} <h3 style={{ margin: 0 }}>{children}</h3>
  </div>
)

const EmojiCards = ({ items, columns = 3 }) => (
  <div className={`grid grid-cols-${columns} gap-6`}>
    {items.map((item, i) => (
      <div key={i} className="card panel-solid">
        <div className="icon-box" aria-hidden="true">
          {item.emoji}
        </div>
        <h4 style={{ margin: '0.75rem 0 0.5rem' }}>{item.title}</h4>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
      </div>
    ))}
  </div>
)

const PartDivider = ({ label }) => (
  <div className="ai-part-divider" role="separator" aria-label={label}>
    <span>{label}</span>
  </div>
)

const Ai = () => {
  const { t } = useTranslation()

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div className="section-title">
          <Bot color="var(--primary)" size={40} />
          <h2 style={{ margin: 0 }}>{t('nav.ai')}</h2>
        </div>
        <p className="section-subtitle">{t('ai.subtitle')}</p>
      </div>

      <div className="alert alert-info">
        <Lightbulb size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
        <p style={{ margin: 0 }}>{t('ai.intro')}</p>
      </div>

      <PartDivider label={t('ai.part1')} />

      {/* Six things to know */}
      <section className="section">
        <SectionTitle icon={MessageSquareWarning} color="var(--primary)">
          {t('ai.safe_use.title')}
        </SectionTitle>
        <p className="section-subtitle" style={{ marginBottom: '1.2rem' }}>
          {t('ai.safe_use.intro')}
        </p>
        <EmojiCards items={tArray(t, 'ai.safe_use.items')} />
      </section>

      {/* Hygiene checklist */}
      <section className="section">
        <SectionTitle icon={ShieldCheck} color="#00ff9d">
          {t('ai.hygiene.title')}
        </SectionTitle>
        <PersistedChecklist
          items={tArray(t, 'ai.hygiene.items')}
          storageKey={AI_CHECKLIST_STORAGE_KEY}
        />
      </section>

      <PartDivider label={t('ai.part2')} />

      {/* Chat vs RAG vs agent */}
      <section className="section">
        <SectionTitle icon={Cpu} color="var(--primary)">
          {t('ai.modes.title')}
        </SectionTitle>
        <p className="section-subtitle" style={{ marginBottom: '1.2rem' }}>
          {t('ai.modes.intro')}
        </p>
        <EmojiCards items={tArray(t, 'ai.modes.cards')} />
      </section>

      {/* MCP */}
      <section className="section">
        <SectionTitle icon={Plug} color="var(--secondary)">
          {t('ai.mcp.title')}
        </SectionTitle>
        <p className="section-subtitle" style={{ marginBottom: '1.2rem' }}>
          {t('ai.mcp.intro')}
        </p>
        <div className="card panel-solid">
          <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
            {tArray(t, 'ai.mcp.points').map((item, i) => (
              <li key={i} style={{ marginBottom: '0.4rem' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Prompt injection */}
      <section className="section">
        <SectionTitle icon={Bug} color="var(--accent)">
          {t('ai.injection.title')}
        </SectionTitle>
        <p className="section-subtitle" style={{ marginBottom: '1.2rem' }}>
          {t('ai.injection.intro')}
        </p>
        <h4 style={{ margin: '0 0 0.75rem' }}>{t('ai.injection.trifecta_title')}</h4>
        <EmojiCards items={tArray(t, 'ai.injection.trifecta')} />
        <div className="alert alert-warning" style={{ marginTop: '1.5rem' }}>
          <AlertTriangle size={20} color="#ffa94d" style={{ flexShrink: 0 }} />
          <p style={{ margin: 0 }}>{t('ai.injection.trifecta_note')}</p>
        </div>
        <div className="card panel-solid" style={{ marginTop: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>{t('ai.injection.defenses_title')}</h4>
          <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
            {tArray(t, 'ai.injection.defenses').map((item, i) => (
              <li key={i} style={{ marginBottom: '0.4rem' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Where your prompt goes */}
      <section className="section">
        <SectionTitle icon={Route} color="var(--primary)">
          {t('ai.data_flow.title')}
        </SectionTitle>
        <p className="section-subtitle" style={{ marginBottom: '1.2rem' }}>
          {t('ai.data_flow.intro')}
        </p>
        <div className="card panel-solid">
          <ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
            {tArray(t, 'ai.data_flow.items').map((item, i) => (
              <li key={i} style={{ marginBottom: '0.4rem' }}>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Before you connect an agent */}
      <section className="section">
        <SectionTitle icon={ClipboardCheck} color="#00ff9d">
          {t('ai.agent_checklist.title')}
        </SectionTitle>
        <PersistedChecklist
          items={tArray(t, 'ai.agent_checklist.items')}
          storageKey={AI_AGENT_CHECKLIST_STORAGE_KEY}
        />
      </section>

      <section className="section">
        <Quiz
          title={t('ai.quiz.title')}
          questions={tArray(t, 'ai.quiz.questions')}
          storageKey="quiz-ai"
        />
      </section>

      <TopicCompletionCard topicId="ai" quizStorageKey="quiz-ai" />
    </div>
  )
}

export default Ai
