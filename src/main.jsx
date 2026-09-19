import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'
import { ProgressProvider } from './contexts/ProgressContext.jsx'
import './index.css'
import './i18n/i18n'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProgressProvider>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </ProgressProvider>
  </React.StrictMode>,
)
