import { useState } from 'react'

const DISMISS_KEY = 'data_freshness_dismissed'

export function DataFreshnessWarning({ meta }) {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISS_KEY) === meta?.content_hash
  )

  if (!meta?.generated_at || dismissed) return null

  const hintDays = meta.refresh_hint_days ?? 30
  const ageMs    = Date.now() - new Date(meta.generated_at).getTime()
  const ageDays  = Math.floor(ageMs / (1000 * 60 * 60 * 24))

  if (ageDays < hintDays) return null

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, meta.content_hash)
    setDismissed(true)
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 200,

        background: '#78350f',
        color: '#fef3c7',
        fontFamily: "'Courier New', monospace",
        fontSize: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
      }}
    >
      <span style={{ flex: 1 }}>
        ⚠ Plan généré il y a {ageDays} jours — relancer <strong>sync:viewer</strong> depuis l'admin
      </span>
      <button
        onClick={handleDismiss}
        aria-label="Fermer l'avertissement"
        style={{
          background: 'transparent',
          border: '1px solid #fef3c7',
          color: '#fef3c7',
          borderRadius: 4,
          padding: '2px 8px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 'inherit',
        }}
      >
        Fermer
      </button>
    </div>
  )
}
