import { useState, useEffect } from 'react'
import { SCHEMA_VERSIONS, safeValidateViewerData } from '@aangee/cottet-schema'
import { PlanSVG } from './components/PlanSVG'
import { BottomSheet } from './components/BottomSheet'
import { InstallPrompt } from './components/InstallPrompt'
import { DataFreshnessWarning } from './components/DataFreshnessWarning'
import { SchemaVersionWarning } from './components/SchemaVersionWarning'
import { useHighlight } from './hooks/useHighlight'

const STRICT = import.meta.env.VITE_SCHEMA_STRICT === 'true'

export default function App() {
  const [data, setData] = useState(null)
  const [meta, setMeta] = useState(null)
  const [dataError, setDataError] = useState(false)
  const [schemaWarning, setSchemaWarning] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data.json`)
      .then((r) => r.json())
      .then((payload) => {
        const parsed = safeValidateViewerData(payload)
        if (!parsed.success) {
          const msg = `Donnees incompatibles (schema). Rafraichir pour la derniere version.`
          if (STRICT) {
            console.error('[schema] strict mode rejected data.json:', parsed.error.issues)
            setDataError(true)
            return
          }
          console.warn('[schema] warn-only: data.json failed validation, displaying anyway', parsed.error.issues)
          setSchemaWarning(msg)
        } else if (payload._meta?.schema_version !== SCHEMA_VERSIONS.viewer) {
          const msg = `Version du plan obsolete (recu ${payload._meta?.schema_version}, attendu ${SCHEMA_VERSIONS.viewer}). Rafraichir.`
          if (STRICT) {
            setDataError(true)
            return
          }
          console.warn('[schema] warn-only: version mismatch', payload._meta?.schema_version)
          setSchemaWarning(msg)
        }

        const { _meta, ...viewerData } = payload
        setMeta(_meta ?? null)
        setData(viewerData)
      })
      .catch(() => setDataError(true))
  }, [])

  const highlighted = useHighlight(selected, data)

  const handleSelectHebergement = (id) => setSelected({ type: 'hebergement', id })
  const handleSelectBorne = (type, id) => setSelected({ type, id })
  const handleDeselect = () => setSelected(null)

  if (dataError) return (
    <div style={{ color: '#f87171', padding: 32, fontFamily: 'monospace', textAlign: 'center' }}>
      Donnees non disponibles ou incompatibles — verifiez votre connexion et rechargez.
    </div>
  )

  return (
    <>
      <SchemaVersionWarning message={schemaWarning} />
      <DataFreshnessWarning meta={meta} />
      <InstallPrompt />
      <PlanSVG
        data={data}
        highlighted={highlighted}
        selected={selected}
        onSelectHebergement={handleSelectHebergement}
        onSelectBorne={handleSelectBorne}
        onDeselect={handleDeselect}
      />
      <BottomSheet
        selected={selected}
        data={data}
        onClose={handleDeselect}
      />
    </>
  )
}
