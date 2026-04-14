import { useRef, useEffect } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

const VB_W = 2560
const VB_H = 1567

const TYPE_COLORS = {
  mh_2ch_3p:     { fill: '#431407', stroke: '#f97316' },
  mh_2ch_4p:     { fill: '#422006', stroke: '#facc15' },
  mh_3ch_6p:     { fill: '#0c4a6e', stroke: '#7dd3fc' },
  resident:      { fill: '#374151', stroke: '#6b7280' },
  dome_cocoon:   { fill: '#3b0764', stroke: '#a78bfa' },
  tente_equipee: { fill: '#422006', stroke: '#facc15' },
  chalet_eco:    { fill: '#292524', stroke: '#a16207' },
  caravane:      { fill: '#450a0a', stroke: '#ef4444' },
  emplacement_nu:{ fill: '#14532d', stroke: '#22c55e' },
  piscine:       { fill: '#0c3d5e', stroke: '#22d3ee' },
  infra:         { fill: '#134e4a', stroke: '#2dd4bf' },
}

function HouseIcon({ fill, stroke }) {
  return (
    <>
      <polygon points="0,-16 -13,-3 13,-3" fill={stroke} opacity={0.95} />
      <rect x="-9" y="-3" width="18" height="14" rx="1" fill={fill} stroke={stroke} strokeWidth={1.5} />
      <rect x="-3" y="4" width="6" height="7" fill={stroke} opacity={0.7} />
    </>
  )
}

function DropIcon({ fill, stroke }) {
  return (
    <path d="M 0,-14 C -8,-5 -10,1 -10,5 C -10,11 -5,15 0,15 C 5,15 10,11 10,5 C 10,1 8,-5 0,-14 Z"
      fill={fill} stroke={stroke} strokeWidth={2} />
  )
}

function BoltIcon({ fill, stroke }) {
  return (
    <path d="M 4,-14 L -5,2 L 2,2 L -5,14 L 11,-2 L 3,-2 L 10,-14 Z"
      fill={fill} stroke={stroke} strokeWidth={1.5} />
  )
}

function BuildingIcon({ fill, stroke }) {
  return (
    <>
      <rect x="-13" y="-13" width="26" height="26" rx="2" fill={fill} stroke={stroke} strokeWidth={1.5} />
      <rect x="-8" y="-7" width="5" height="6" fill={stroke} opacity={0.8} />
      <rect x="3"  y="-7" width="5" height="6" fill={stroke} opacity={0.8} />
      <rect x="-4" y="3"  width="8" height="10" rx="1" fill={stroke} opacity={0.7} />
    </>
  )
}

function HebergementMarker({ h, isHighlighted, onClick }) {
  const colors = TYPE_COLORS[h.type] ?? { fill: '#1f2937', stroke: '#6b7280' }
  return (
    <g
      className={isHighlighted ? 'marker-highlighted' : ''}
      style={{ cursor: 'pointer' }}
      onClick={(e) => { e.stopPropagation(); onClick(h.id) }}
    >
      <circle cx={h.cx} cy={h.cy} r={28} fill="transparent" />
      {isHighlighted && (
        <circle className="pulse-ring" cx={h.cx} cy={h.cy} r={22}
          fill="none" stroke={colors.stroke} strokeWidth={2.5} opacity={0.9} />
      )}
      <g transform={`translate(${h.cx}, ${h.cy})`} filter="url(#icon-border)">
        {h.type === 'infra'
          ? <BuildingIcon fill={colors.fill} stroke={colors.stroke} />
          : <HouseIcon    fill={colors.fill} stroke={colors.stroke} />}
      </g>
      <text x={h.cx} y={h.cy + 27} textAnchor="middle"
        fontSize={10} fontWeight="700" fill={colors.stroke}
        fontFamily="'Courier New', monospace" pointerEvents="none">
        {h.nom}
      </text>
    </g>
  )
}

function BorneEauMarker({ b, isHighlighted, onClick }) {
  return (
    <g
      className={isHighlighted ? 'marker-highlighted' : ''}
      style={{ cursor: 'pointer' }}
      onClick={(e) => { e.stopPropagation(); onClick(b.id) }}
    >
      <circle cx={b.x} cy={b.y} r={28} fill="transparent" />
      {isHighlighted && (
        <circle className="pulse-ring" cx={b.x} cy={b.y} r={22}
          fill="none" stroke="#38bdf8" strokeWidth={2.5} opacity={0.9} />
      )}
      <g transform={`translate(${b.x}, ${b.y})`}>
        <DropIcon fill="#0c4a6e" stroke="#38bdf8" />
      </g>
      <text x={b.x} y={b.y + 28} textAnchor="middle" fontSize={9} fontWeight="700"
        fill="#38bdf8" fontFamily="'Courier New', monospace" pointerEvents="none">
        {b.num}
      </text>
    </g>
  )
}

function BorneElecMarker({ b, isHighlighted, onClick }) {
  return (
    <g
      className={isHighlighted ? 'marker-highlighted' : ''}
      style={{ cursor: 'pointer' }}
      onClick={(e) => { e.stopPropagation(); onClick(b.id) }}
    >
      <circle cx={b.x} cy={b.y} r={28} fill="transparent" />
      {isHighlighted && (
        <circle className="pulse-ring" cx={b.x} cy={b.y} r={22}
          fill="none" stroke="#fbbf24" strokeWidth={2.5} opacity={0.9} />
      )}
      <g transform={`translate(${b.x}, ${b.y})`}>
        <BoltIcon fill="#451a03" stroke="#fbbf24" />
      </g>
      <text x={b.x} y={b.y + 28} textAnchor="middle" fontSize={9} fontWeight="700"
        fill="#fbbf24" fontFamily="'Courier New', monospace" pointerEvents="none">
        {b.num}
      </text>
    </g>
  )
}

// Lignes pointillées entre hébergement et ses bornes (ou borne et ses hébergements)
function ConnectionLines({ selected, data }) {
  if (!selected || !data) return null
  const lines = []

  if (selected.type === 'hebergement') {
    const h = data.hebergements.find(x => x.id === selected.id)
    if (!h) return null
    if (h.borne_eau) {
      const b = data.bornes_eau.find(x => x.id === h.borne_eau)
      if (b) lines.push({ x1: h.cx, y1: h.cy, x2: b.x, y2: b.y, color: '#38bdf8' })
    }
    if (h.borne_elec) {
      const b = data.bornes_elec.find(x => x.id === h.borne_elec)
      if (b) lines.push({ x1: h.cx, y1: h.cy, x2: b.x, y2: b.y, color: '#fbbf24' })
    }
  } else if (selected.type === 'borne_eau') {
    const b = data.bornes_eau.find(x => x.id === selected.id)
    if (!b) return null
    data.hebergements
      .filter(h => h.borne_eau === b.id)
      .forEach(h => lines.push({ x1: b.x, y1: b.y, x2: h.cx, y2: h.cy, color: '#38bdf8' }))
    ;(b.distribue_vers ?? []).forEach(targetId => {
      const t = data.bornes_eau.find(x => x.id === targetId)
      if (t) lines.push({ x1: b.x, y1: b.y, x2: t.x, y2: t.y, color: '#38bdf8', thin: true })
    })
  } else if (selected.type === 'borne_elec') {
    const b = data.bornes_elec.find(x => x.id === selected.id)
    if (!b) return null
    data.hebergements
      .filter(h => h.borne_elec === b.id)
      .forEach(h => lines.push({ x1: b.x, y1: b.y, x2: h.cx, y2: h.cy, color: '#fbbf24' }))
    ;(b.distribue_vers ?? []).forEach(targetId => {
      const t = data.bornes_elec.find(x => x.id === targetId)
      if (t) lines.push({ x1: b.x, y1: b.y, x2: t.x, y2: t.y, color: '#fbbf24', thin: true })
    })
  }

  return (
    <>
      {lines.map((l, i) => (
        <line key={i}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={l.color}
          strokeWidth={l.thin ? 1.5 : 3}
          strokeDasharray={l.thin ? '4 6' : '14 8'}
          opacity={l.thin ? 0.55 : 0.7}
          pointerEvents="none" />
      ))}
    </>
  )
}

// Calcule les points impliqués et zoome pour les englober tous
function zoomToFitSelection(transformRef, selected, data) {
  if (!selected || !data || !transformRef.current) return
  const points = []

  if (selected.type === 'hebergement') {
    const h = data.hebergements.find(x => x.id === selected.id)
    if (!h) return
    points.push({ x: h.cx, y: h.cy })
    if (h.borne_eau) {
      const b = data.bornes_eau.find(x => x.id === h.borne_eau)
      if (b) points.push({ x: b.x, y: b.y })
    }
    if (h.borne_elec) {
      const b = data.bornes_elec.find(x => x.id === h.borne_elec)
      if (b) points.push({ x: b.x, y: b.y })
    }
  } else if (selected.type === 'borne_eau') {
    const b = data.bornes_eau.find(x => x.id === selected.id)
    if (!b) return
    points.push({ x: b.x, y: b.y })
    data.hebergements.filter(h => h.borne_eau === b.id)
      .forEach(h => points.push({ x: h.cx, y: h.cy }))
    ;(b.distribue_vers ?? []).forEach(targetId => {
      const t = data.bornes_eau.find(x => x.id === targetId)
      if (t) points.push({ x: t.x, y: t.y })
    })
  } else if (selected.type === 'borne_elec') {
    const b = data.bornes_elec.find(x => x.id === selected.id)
    if (!b) return
    points.push({ x: b.x, y: b.y })
    data.hebergements.filter(h => h.borne_elec === b.id)
      .forEach(h => points.push({ x: h.cx, y: h.cy }))
    ;(b.distribue_vers ?? []).forEach(targetId => {
      const t = data.bornes_elec.find(x => x.id === targetId)
      if (t) points.push({ x: t.x, y: t.y })
    })
  }

  if (!points.length) return

  const pad = 60
  const minX = Math.min(...points.map(p => p.x)) - pad
  const maxX = Math.max(...points.map(p => p.x)) + pad
  const minY = Math.min(...points.map(p => p.y)) - pad
  const maxY = Math.max(...points.map(p => p.y)) + pad

  const boxW = maxX - minX
  const boxH = maxY - minY
  const availW = window.innerWidth
  const availH = window.innerHeight * 0.58  // au-dessus de la sheet

  const scale = Math.min(availW / boxW, availH / boxH, 2.5)

  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  const tx = availW / 2 - cx * scale
  const ty = availH / 2 - cy * scale

  transformRef.current.setTransform(tx, ty, scale, 350, 'easeOut')
}

export function PlanSVG({ data, highlighted, selected, onSelectHebergement, onSelectBorne, onDeselect }) {
  const transformRef = useRef(null)

  useEffect(() => {
    zoomToFitSelection(transformRef, selected, data)
  }, [selected, data])

  if (!data) return null

  return (
    <TransformWrapper
      ref={transformRef}
      initialScale={0.3}
      minScale={0.1}
      maxScale={4}
      centerOnInit
    >
      <TransformComponent
        wrapperStyle={{ width: '100vw', height: '100vh' }}
        contentStyle={{ width: VB_W, height: VB_H }}
      >
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          style={{ width: VB_W, height: VB_H, display: 'block' }}
          onClick={onDeselect}
        >
          <defs>
            <filter id="icon-border" x="-30%" y="-30%" width="160%" height="160%">
              <feMorphology in="SourceAlpha" operator="dilate" radius="0.5" result="expanded"/>
              <feFlood floodColor="white" floodOpacity="0.85" result="white"/>
              <feComposite in="white" in2="expanded" operator="in" result="border"/>
              <feMerge>
                <feMergeNode in="border"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <image href={`${import.meta.env.BASE_URL}plan_fond.png`}
            x={0} y={0} width={VB_W} height={VB_H}
            opacity={0.5} style={{ pointerEvents: 'none' }} />

          <ConnectionLines selected={selected} data={data} />

          {data.hebergements.map(h => (
            <HebergementMarker
              key={h.id}
              h={h}
              isHighlighted={highlighted.hebergements.has(h.id)}
              onClick={onSelectHebergement}
            />
          ))}

          {data.bornes_eau.map(b => (
            <BorneEauMarker
              key={b.id}
              b={b}
              isHighlighted={highlighted.bornes_eau.has(b.id)}
              onClick={(id) => onSelectBorne('borne_eau', id)}
            />
          ))}

          {data.bornes_elec.map(b => (
            <BorneElecMarker
              key={b.id}
              b={b}
              isHighlighted={highlighted.bornes_elec.has(b.id)}
              onClick={(id) => onSelectBorne('borne_elec', id)}
            />
          ))}
        </svg>
      </TransformComponent>
    </TransformWrapper>
  )
}
