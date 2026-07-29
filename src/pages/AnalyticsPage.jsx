import { useState } from 'react'
import { useSeo } from '../lib/useSeo.js'
import { fetchSummary, isConfigured } from '../lib/analytics.js'
import './AnalyticsPage.css'

/**
 * The analytics dashboard. Unlisted, not linked from anywhere, noindex.
 *
 * WHAT PROTECTS THIS, since the page itself protects nothing: the passphrase is
 * never compared here. It is posted to analytics_summary(), a SECURITY DEFINER
 * function that checks it against a bcrypt hash inside Postgres and returns
 * aggregates. The events table has no SELECT policy for anon, so the key in the
 * bundle cannot read a single row of raw data.
 *
 * That matters because the alternative — checking a passphrase in this
 * component — would be theatre: the check would run on the visitor's own
 * machine, guarding data their anon key could already fetch directly.
 *
 * The passphrase is held in component state only. It is not persisted, so a
 * refresh asks again; a dashboard that stays unlocked forever on a shared
 * laptop is the worse trade.
 */
function AnalyticsPage() {
  useSeo()

  const [passphrase, setPassphrase] = useState('')
  const [days, setDays] = useState(30)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      setData(await fetchSummary(passphrase, days))
    } catch (caught) {
      setData(null)
      setError(caught.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="section analytics-page">
      <div className="container">
        <h1 className="analytics-heading">WhatsApp clicks</h1>

        {!isConfigured() && (
          <p className="analytics-error">
            This build has no Supabase configuration, so there is nothing to
            read. VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set at
            build time — Vite inlines them, so setting them on the running
            container does nothing.
          </p>
        )}

        <form className="analytics-form" onSubmit={handleSubmit}>
          <div className="analytics-field">
            <label htmlFor="analytics-passphrase">Passphrase</label>
            <input
              id="analytics-passphrase"
              type="password"
              autoComplete="current-password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
            />
          </div>
          <div className="analytics-field">
            <label htmlFor="analytics-days">Days</label>
            <input
              id="analytics-days"
              type="number"
              min="1"
              max="365"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            />
          </div>
          <button type="submit" disabled={isLoading || !passphrase}>
            {isLoading ? 'Loading…' : 'Show me'}
          </button>
        </form>

        {/* Errors are announced: this page is used by one person who may well be
            on a phone, and a silent failure looks identical to a quiet week. */}
        <div aria-live="polite">
          {error && <p className="analytics-error">{error}</p>}
        </div>

        {data && (
          <div className="analytics-results">
            <div className="analytics-totals">
              <p className="analytics-stat">
                <span className="analytics-stat-n">{data.total}</span>
                <span className="analytics-stat-label">clicks</span>
              </p>
              <p className="analytics-stat">
                <span className="analytics-stat-n">{data.sessions}</span>
                <span className="analytics-stat-label">separate visits</span>
              </p>
              <p className="analytics-stat-note">in the last {data.days} days</p>
            </div>

            <AnalyticsTable
              caption="Which button"
              rows={data.by_source}
              keyOf={(row) => row.source}
            />
            <AnalyticsTable
              caption="Which page"
              rows={data.by_path}
              keyOf={(row) => row.path}
            />
            <AnalyticsTable caption="By day" rows={data.by_day} keyOf={(row) => row.day} />
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * One aggregate breakdown. A real <table> with a <caption>, not a stack of
 * divs — this is tabular data, and the semantics come free.
 */
function AnalyticsTable({ caption, rows, keyOf }) {
  if (!rows?.length) {
    return (
      <div className="analytics-table-wrap">
        <h2 className="analytics-table-heading">{caption}</h2>
        <p className="analytics-empty">Nothing recorded yet.</p>
      </div>
    )
  }

  return (
    <div className="analytics-table-wrap">
      <table className="analytics-table">
        <caption className="analytics-table-heading">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Clicks</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={keyOf(row)}>
              <td>{keyOf(row)}</td>
              <td>{row.n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AnalyticsPage
