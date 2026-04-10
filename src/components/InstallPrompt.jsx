import { useState, useEffect } from 'react'

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}

export function InstallPrompt() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist()
    }
    if (isIOS() && !localStorage.getItem('install-prompt-shown')) {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem('install-prompt-shown', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="install-prompt">
      <span>Pour installer : appuie sur <strong>Partager</strong> → <strong>Sur l'écran d'accueil</strong></span>
      <button onClick={dismiss} aria-label="Fermer">✕</button>
    </div>
  )
}
