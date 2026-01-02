import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Quiz = ({ title, questions = [], storageKey, onComplete }) => {
    const { t } = useTranslation();
    const shuffled = useMemo(() => questions.map((q) => ({ ...q })), [questions]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(() => {
        if (!storageKey || typeof window === 'undefined') return null;
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    });

    const question = shuffled[current];

    const onSelect = (index) => {
        if (selected !== null) return;
        setSelected(index);
        const isCorrect = index === question.answer;
        setScore((s) => s + (isCorrect ? 1 : 0));
    };

    const next = () => {
        if (current === shuffled.length - 1) {
            setShowResult(true);
            const payload = { score, total: shuffled.length };
            const percent = (score / shuffled.length) * 100;
            if (storageKey) {
                const bestPercent = bestScore ? (bestScore.score / bestScore.total) * 100 : -1;
                if (percent > bestPercent) {
                    window.localStorage.setItem(storageKey, JSON.stringify(payload));
                    setBestScore(payload);
                }
            }
            if (percent >= 50 && onComplete) {
                onComplete();
            }
        } else {
            setCurrent((c) => c + 1);
            setSelected(null);
        }
    };

    useEffect(() => {
        if (!storageKey) return;
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
            try {
                setBestScore(JSON.parse(raw));
            } catch {
                setBestScore(null);
            }
        }
    }, [storageKey]);

    if (!question) return null;

    return (
        <div className="card panel-solid">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div>
                    <h4 style={{ margin: 0 }}>{title}</h4>
                    <p style={{ margin: '0.2rem 0', color: 'var(--text-muted)' }}>
                        {t('common.quiz_question')} {current + 1} / {shuffled.length}
                    </p>
                </div>
                <span className="pill">{Math.round((score / shuffled.length) * 100)}%</span>
            </div>
            <p style={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.75rem' }}>{question.prompt}</p>
            <div className="quiz-options">
                {question.options.map((opt, idx) => {
                    const isCorrect = selected !== null && idx === question.answer;
                    const isWrong = selected === idx && idx !== question.answer;
                    return (
                        <button
                            key={idx}
                            className={`quiz-option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                            onClick={() => onSelect(idx)}
                            aria-pressed={selected === idx}
                        >
                            <span>{opt}</span>
                        </button>
                    );
                })}
            </div>
            {selected !== null && (
                <div className="alert" style={{ marginTop: '0.75rem', borderColor: selected === question.answer ? '#00ff9d' : 'var(--accent)' }}>
                    <div className="alert-content">
                        <p style={{ marginBottom: 0 }}>
                            {selected === question.answer ? question.correct || t('common.quiz_correct_fallback') : question.explainer || t('common.quiz_wrong_fallback')}
                        </p>
                    </div>
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                    className="btn btn-glass"
                    onClick={next}
                    disabled={selected === null && !showResult}
                >
                    {current === shuffled.length - 1 ? t('common.quiz_finish') : t('common.quiz_next')}
                </button>
            </div>
            {showResult && (
                <div className="pill pill-success" style={{ marginTop: '0.75rem', alignSelf: 'flex-start' }}>
                    {t('common.quiz_score')}: {score} / {shuffled.length}
                </div>
            )}
            {bestScore && (
                <div className="pill" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>
                    {t('common.quiz_best')}: {Math.round((bestScore.score / bestScore.total) * 100)}%
                </div>
            )}
        </div>
    );
};

export default Quiz;
