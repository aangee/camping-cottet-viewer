export function SchemaVersionWarning({ message }) {
  if (!message) return null

  const handleReload = () => window.location.reload()

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 200,
        background: '#7f1d1d',
        color: '#fee2e2',
        fontFamily: "'Courier New', monospace",
        fontSize: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={handleReload}
        aria-label="Recharger la page"
        style={{
          background: 'transparent',
          border: '1px solid #fee2e2',
          color: '#fee2e2',
          borderRadius: 4,
          padding: '2px 8px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 'inherit',
        }}
      >
        Rafraichir
      </button>
    </div>
  )
}
