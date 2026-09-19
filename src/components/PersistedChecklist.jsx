import React, { useEffect, useState } from 'react'
import { STORAGE_RESET_EVENT } from '../storageKeys'

const readState = (storageKey, length) => {
  const empty = Array(length).fill(false)
  if (typeof window === 'undefined') return empty
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || 'null')
    if (!Array.isArray(parsed)) return empty
    return Array.from({ length }, (_, i) => Boolean(parsed[i]))
  } catch {
    return empty
  }
}

/** Tick-off list whose state survives reloads and clears with the global reset. */
const PersistedChecklist = ({ items, storageKey }) => {
  const [completed, setCompleted] = useState(() => readState(storageKey, items.length))

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(completed))
    } catch {
      // localStorage may be unavailable; the list still works for this visit
    }
  }, [completed, storageKey])

  useEffect(() => {
    const handleReset = () => setCompleted(Array(items.length).fill(false))
    window.addEventListener(STORAGE_RESET_EVENT, handleReset)
    return () => window.removeEventListener(STORAGE_RESET_EVENT, handleReset)
  }, [items.length])

  const toggle = index =>
    setCompleted(prev => prev.map((value, i) => (i === index ? !value : value)))

  return (
    <div className="checklist">
      {items.map((item, i) => (
        <button
          key={i}
          type="button"
          className={`checklist-item ${completed[i] ? 'completed' : ''}`}
          onClick={() => toggle(i)}
          aria-pressed={Boolean(completed[i])}
        >
          <span className="circle">{completed[i] ? '✓' : ''}</span>
          <span style={{ fontWeight: 600 }}>{item}</span>
        </button>
      ))}
    </div>
  )
}

export default PersistedChecklist
