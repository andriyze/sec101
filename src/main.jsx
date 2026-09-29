import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import App, { preloadRoute } from './App.jsx'
import { ProgressProvider } from './contexts/ProgressContext.jsx'
import './index.css'
import i18n, { loadLanguage } from './i18n/i18n'

const render = () =>
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ProgressProvider>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </ProgressProvider>
    </React.StrictMode>,
  )

// The first render replaces the prerendered HTML, so load the strings and the current page's
// chunk first; otherwise the page would blank to the Suspense fallback while they download.
// Render even if a load fails: a missing page chunk then reaches the error boundary's reload button.
Promise.all([loadLanguage(i18n.language), preloadRoute(window.location.pathname)])
  .catch(() => {})
  .then(render)
