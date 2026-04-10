import { useState, useEffect } from 'react'
import { PlanSVG } from './components/PlanSVG'
import { BottomSheet } from './components/BottomSheet'
import { InstallPrompt } from './components/InstallPrompt'
import { useHighlight } from './hooks/useHighlight'

export default function App() {
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data.json`)
      .then(r => r.json())
      .then(setData)
  }, [])

  const highlighted = useHighlight(selected, data)

  const handleSelectHebergement = (id) => setSelected({ type: 'hebergement', id })
  const handleSelectBorne = (type, id) => setSelected({ type, id })
  const handleDeselect = () => setSelected(null)

  return (
    <>
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
