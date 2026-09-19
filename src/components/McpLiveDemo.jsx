import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Radio, ListTree, Calculator } from 'lucide-react'

const ENDPOINT = 'https://www.a3sec.net/api/mcp'
const TOOL_CALL = {
  jsonrpc: '2.0',
  id: 2,
  method: 'tools/call',
  params: { name: 'mortgage_quote', arguments: { price: 400000, country: 'US' } },
}
const TOOL_LIST = { jsonrpc: '2.0', id: 1, method: 'tools/list' }

const usd = value =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

const send = async body => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10000)
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const json = await response.json()
    if (json.error) throw new Error(json.error.message || 'JSON-RPC error')
    return json
  } finally {
    clearTimeout(timer)
  }
}

/** Sends one real MCP request to the a3sec.net server and shows what came back. */
const McpLiveDemo = () => {
  const { t } = useTranslation()
  const k = key => t(`ai.mcp.live.${key}`)
  const [status, setStatus] = useState('idle')
  const [request, setRequest] = useState(null)
  const [tools, setTools] = useState(null)
  const [quote, setQuote] = useState(null)

  const run = async body => {
    setStatus('loading')
    setRequest(body)
    setTools(null)
    setQuote(null)
    try {
      const json = await send(body)
      if (body.method === 'tools/list') {
        setTools(json.result?.tools || [])
      } else {
        const text = json.result?.content?.find(part => part.type === 'text')?.text || ''
        let parsed = null
        try {
          parsed = JSON.parse(text)
        } catch {
          parsed = null
        }
        setQuote({ text, parsed })
      }
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const monthly = quote?.parsed?.monthly
  const inputs = quote?.parsed?.inputs

  return (
    <div className="card panel-solid mcp-live">
      <div className="section-title" style={{ marginBottom: '0.5rem' }}>
        <Radio size={20} color="#00ff9d" /> <h4 style={{ margin: 0 }}>{k('title')}</h4>
      </div>
      <p style={{ color: 'var(--text-muted)', marginTop: 0 }}>{k('desc')}</p>

      <div className="mcp-live-actions">
        <button type="button" className="btn btn-glass" onClick={() => run(TOOL_LIST)} disabled={status === 'loading'}>
          <ListTree size={16} /> {k('list_button')}
        </button>
        <button type="button" className="btn btn-glass" onClick={() => run(TOOL_CALL)} disabled={status === 'loading'}>
          <Calculator size={16} /> {k('call_button')}
        </button>
      </div>

      {request && (
        <div className="mcp-live-block">
          <span className="mcp-live-label">{k('request_label')}</span>
          <pre className="mcp-live-pre">{JSON.stringify(request, null, 2)}</pre>
        </div>
      )}

      <div className="mcp-live-block" role="status" aria-live="polite">
        {status === 'loading' && <span className="mcp-live-status">{k('loading')}</span>}
        {status === 'error' && <span className="mcp-live-status error">{k('error')}</span>}
        {status === 'done' && tools && (
          <>
            <span className="mcp-live-label">{k('tools_label')}</span>
            <ul className="mcp-live-tools">
              {tools.map(tool => (
                <li key={tool.name}>
                  <code>{tool.name}</code>
                  <span>{tool.description}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        {status === 'done' && quote && (
          <>
            <span className="mcp-live-label">{k('result_label')}</span>
            {monthly ? (
              <dl className="mcp-live-summary">
                <div>
                  <dt>{k('monthly_total')}</dt>
                  <dd className="highlight">{usd(monthly.total)}</dd>
                </div>
                <div>
                  <dt>{k('pi')}</dt>
                  <dd>{usd(monthly.principalAndInterest)}</dd>
                </div>
                <div>
                  <dt>{k('rate')}</dt>
                  <dd>{inputs?.aprPct}%</dd>
                </div>
                <div>
                  <dt>{k('region')}</dt>
                  <dd>{quote.parsed.region}</dd>
                </div>
              </dl>
            ) : null}
            <details className="mcp-live-raw">
              <summary>{k('raw')}</summary>
              <pre className="mcp-live-pre">{quote.text}</pre>
            </details>
          </>
        )}
      </div>
    </div>
  )
}

export default McpLiveDemo
