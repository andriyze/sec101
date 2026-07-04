import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QUIZ_UPDATED_EVENT } from '../storageKeys'
import { isBetterScore, readStoredScore, shuffleIndices } from './quizUtils'

const QuizSession = ({ title, questions, storageKey, onComplete }) => {
  const { t } = useTranslation()
  const [order, setOrder] = useState(() => shuffleIndices(questions.length))
  const [optionOrders, setOptionOrders] = useState(() =>
    questions.map(question => shuffleIndices(question.options?.length || 0))
  )
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [bestScore, setBestScore] = useState(() => readStoredScore(storageKey))

  const restart = () => {
    setOrder(shuffleIndices(questions.length))
    setOptionOrders(questions.map(question => shuffleIndices(question.options?.length || 0)))
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setShowResult(false)
  }

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return undefined

    const refreshBestScore = event => {
      if (event.detail?.storageKey && event.detail.storageKey !== storageKey) return
      // Native cross-tab storage events carry the written key; ignore
      // writes to unrelated keys (event.key is null on clear()).
      if (event.type === 'storage' && event.key !== null && event.key !== storageKey) return

      const stored = readStoredScore(storageKey)
      setBestScore(stored)
      if (!stored) {
        // Global reset cleared the stored score — start fresh.
        setOrder(shuffleIndices(questions.length))
        setOptionOrders(questions.map(question => shuffleIndices(question.options?.length || 0)))
        setCurrent(0)
        setSelected(null)
        setScore(0)
        setShowResult(false)
      }
    }

    window.addEventListener(QUIZ_UPDATED_EVENT, refreshBestScore)
    window.addEventListener('storage', refreshBestScore)

    return () => {
      window.removeEventListener(QUIZ_UPDATED_EVENT, refreshBestScore)
      window.removeEventListener('storage', refreshBestScore)
    }
  }, [questions, questions.length, storageKey])

  const questionIndex = order[current]
  const question = questions[questionIndex]

  const onSelect = index => {
    if (selected !== null || showResult) return
    setSelected(index)
    const isCorrect = index === question.answer
    setScore(s => s + (isCorrect ? 1 : 0))
  }

  const finish = () => {
    if (showResult) return
    setShowResult(true)
    const payload = { score, total: order.length }
    const percent = (score / order.length) * 100
    if (storageKey && typeof window !== 'undefined') {
      if (isBetterScore(payload, bestScore)) {
        window.localStorage.setItem(storageKey, JSON.stringify(payload))
        setBestScore(payload)
      }

      window.dispatchEvent(
        new CustomEvent(QUIZ_UPDATED_EVENT, {
          detail: { storageKey },
        })
      )
    }
    if (percent >= 50 && onComplete) {
      onComplete()
    }
  }

  const next = () => {
    if (selected === null) return
    if (current === order.length - 1) {
      finish()
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
    }
  }

  if (!question) return null

  const answeredCount = current + (selected !== null ? 1 : 0)
  const optionOrder = optionOrders[questionIndex] || shuffleIndices(question.options?.length || 0)

  return (
    <div className="card panel-solid">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem',
        }}
      >
        <div>
          <h4 style={{ margin: 0 }}>{title}</h4>
          <p style={{ margin: '0.2rem 0', color: 'var(--text-muted)' }}>
            {t('common.quiz_question')} {current + 1} / {order.length}
          </p>
        </div>
        {answeredCount > 0 && !showResult && (
          <span className="pill">
            {t('common.quiz_score')}: {score} / {answeredCount}
          </span>
        )}
      </div>
      <p style={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.75rem' }}>
        {question.prompt}
      </p>
      <div className="quiz-options">
        {optionOrder.map(idx => {
          const opt = question.options[idx]
          const isCorrect = selected !== null && idx === question.answer
          const isWrong = selected === idx && idx !== question.answer
          return (
            <button
              key={idx}
              className={`quiz-option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
              onClick={() => onSelect(idx)}
              aria-pressed={selected === idx}
            >
              <span>{opt}</span>
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <div
          className="alert"
          role="status"
          style={{
            marginTop: '0.75rem',
            borderColor: selected === question.answer ? '#00ff9d' : 'var(--accent)',
          }}
        >
          <div className="alert-content">
            <p style={{ marginBottom: 0 }}>
              {selected === question.answer
                ? question.correct || t('common.quiz_correct_fallback')
                : question.explainer || t('common.quiz_wrong_fallback')}
            </p>
            {selected === question.answer &&
              question.explainer &&
              question.explainer !== question.correct && (
                <p style={{ margin: '0.35rem 0 0', color: 'var(--text-muted)' }}>
                  {question.explainer}
                </p>
              )}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        {showResult ? (
          <button className="btn btn-glass" onClick={restart}>
            {t('common.quiz_retake')}
          </button>
        ) : (
          <button className="btn btn-glass" onClick={next} disabled={selected === null}>
            {current === order.length - 1 ? t('common.quiz_finish') : t('common.quiz_next')}
          </button>
        )}
      </div>
      {showResult && (
        <div
          className="pill pill-success"
          role="status"
          style={{ marginTop: '0.75rem', alignSelf: 'flex-start' }}
        >
          {t('common.quiz_score')}: {score} / {order.length}
        </div>
      )}
      {bestScore && (
        <div className="pill" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>
          {t('common.quiz_best')}: {Math.round((bestScore.score / bestScore.total) * 100)}%
        </div>
      )}
    </div>
  )
}

const Quiz = ({ title, questions = [], storageKey, onComplete }) => {
  const { i18n } = useTranslation()
  const safeQuestions = Array.isArray(questions) ? questions : []

  return (
    <QuizSession
      key={`${storageKey || title}:${i18n.resolvedLanguage || i18n.language}:${safeQuestions.length}`}
      title={title}
      questions={safeQuestions}
      storageKey={storageKey}
      onComplete={onComplete}
    />
  )
}

export default Quiz
