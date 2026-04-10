const LABELS = {
  mh_2ch_3p:    'MH 2CH/3P',
  mh_2ch_4p:    'MH 2CH/4P',
  mh_3ch_6p:    'MH 3CH/6P',
  resident:     'Résident',
  dome_cocoon:  'Dôme Cocoon',
  tente_equipee:'Tente équipée',
  chalet_eco:   'Chalet Eco-lodge',
  caravane:     'Caravane',
  emplacement_nu:'Emplacement nu',
}

function HebergementContent({ h }) {
  return (
    <>
      <div className="sheet-title">Parcelle {h.nom}</div>
      <div className="sheet-label">{LABELS[h.type] ?? h.type}</div>
      <div style={{ marginTop: 12 }}>
        <div className="sheet-row">
          <span>💧</span>
          <span>{h.borne_eau ?? 'Non raccordé'}</span>
        </div>
        <div className="sheet-row">
          <span>⚡</span>
          <span>{h.borne_elec ?? 'Non raccordé'}</span>
        </div>
      </div>
    </>
  )
}

function BorneEauContent({ borne }) {
  return (
    <>
      <div className="sheet-title">{borne.num} — Borne eau 💧</div>
      {borne.parcelles.length > 0 ? (
        <>
          <div className="sheet-label" style={{ marginBottom: 8 }}>Parcelles :</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {borne.parcelles.map(p => (
              <span key={p} style={{
                background: '#0c4a6e', color: '#38bdf8',
                borderRadius: 6, padding: '2px 8px', fontSize: 14, fontWeight: 700
              }}>{p}</span>
            ))}
          </div>
        </>
      ) : (
        <div className="sheet-label">Infrastructure (pas de parcelle numérotée)</div>
      )}
    </>
  )
}

function BorneElecContent({ borne }) {
  return (
    <>
      <div className="sheet-title">{borne.num} — Borne élec ⚡</div>
      {borne.parcelles.length > 0 ? (
        <>
          <div className="sheet-label" style={{ marginBottom: 8 }}>Parcelles :</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {borne.parcelles.map(p => (
              <span key={p} style={{
                background: '#451a03', color: '#fbbf24',
                borderRadius: 6, padding: '2px 8px', fontSize: 14, fontWeight: 700
              }}>{p}</span>
            ))}
          </div>
        </>
      ) : (
        <div className="sheet-label">Borne sans parcelles enregistrées</div>
      )}
    </>
  )
}

export function BottomSheet({ selected, data, onClose }) {
  const isOpen = selected !== null && data !== null

  const content = (() => {
    if (!selected || !data) return null
    if (selected.type === 'hebergement') {
      const h = data.hebergements.find(x => x.id === selected.id)
      return h ? <HebergementContent h={h} /> : null
    }
    if (selected.type === 'borne_eau') {
      const b = data.bornes_eau.find(x => x.id === selected.id)
      return b ? <BorneEauContent borne={b} /> : null
    }
    if (selected.type === 'borne_elec') {
      const b = data.bornes_elec.find(x => x.id === selected.id)
      return b ? <BorneElecContent borne={b} /> : null
    }
    return null
  })()

  return (
    <>
      {isOpen && <div className="backdrop" onClick={onClose} />}
      <div className={`bottom-sheet ${isOpen ? 'open' : ''}`}>
        <div className="bottom-sheet-handle" />
        {content}
      </div>
    </>
  )
}
