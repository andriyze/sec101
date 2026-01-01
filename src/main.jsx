import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ProgressProvider } from './contexts/ProgressContext.jsx'
import './index.css'
import './i18n/i18n'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </React.StrictMode>,
)
