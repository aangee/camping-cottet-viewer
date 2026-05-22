import { useState, useEffect } from 'react'
import { PlanSVG } from './components/PlanSVG'
import { BottomSheet } from './components/BottomSheet'
import { InstallPrompt } from './components/InstallPrompt'
import { DataFreshnessWarning } from './components/DataFreshnessWarning'
import { useHighlight } from './hooks/useHighlight'

export default function App() {
  const [data, setData] = useState(null)
  const [meta, setMeta] = useState(null)
  const [dataError, setDataError] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data.json`)
      .then(r => r.json())
      .then(({ _meta, ...viewerData }) => {
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
      Données non disponibles — vérifiez votre connexion et rechargez.
    </div>
  )

  return (
    <>
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
