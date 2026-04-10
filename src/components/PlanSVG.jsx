import { useRef, useEffect } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

const VB_W = 2560
const VB_H = 1567

const TYPE_COLORS = {
  mh_2ch_3p:     { fill: '#431407', stroke: '#f97316' },
  mh_2ch_4p:     { fill: '#422006', stroke: '#facc15' },
  mh_3ch_6p:     { fill: '#0c4a6e', stroke: '#7dd3fc' },
  resident:      { fill: '#1f2937', stroke: '#6b7280' },
  dome_cocoon:   { fill: '#3b0764', stroke: '#a78bfa' },
  tente_equipee: { fill: '#422006', stroke: '#facc15' },
  chalet_eco:    { fill: '#292524', stroke: '#a16207' },
  caravane:      { fill: '#450a0a', stroke: '#ef4444' },
  emplacement_nu:{ fill: '#14532d', stroke: '#22c55e' },
}

// Maison centrée en (0,0) — murs + toit
function HouseIcon({ fill, stroke }) {
  return (
    <>
      {/* Toit */}
      <polygon points="0,-16 -13,-3 13,-3"
        fill={stroke} opacity={0.95} />
      {/* Murs */}
      <rect x="-9" y="-3" width="18" height="14" rx="1"
        fill={fill} stroke={stroke} strokeWidth={1.5} />
      {/* Porte */}
      <rect x="-3" y="4" width="6" height="7"
        fill={stroke} opacity={0.7} />
    </>
  )
}

// Goutte d'eau centrée en (0,0)
function DropIcon({ fill, stroke }) {
  return (
    <path d="M 0,-14 C -8,-5 -10,1 -10,5 C -10,11 -5,15 0,15 C 5,15 10,11 10,5 C 10,1 8,-5 0,-14 Z"
      fill={fill} stroke={stroke} strokeWidth={2} />
  )
}

// Éclair centré en (0,0)
function BoltIcon({ fill, stroke }) {
  return (
    <path d="M 4,-14 L -5,2 L 2,2 L -5,14 L 11,-2 L 3,-2 L 10,-14 Z"
      fill={fill} stroke={stroke} strokeWidth={1.5} />
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
      {isHighlighted && (
        <circle className="pulse-ring" cx={h.cx} cy={h.cy} r={22}
          fill="none" stroke={colors.stroke} strokeWidth={2.5} opacity={0.9} />
      )}
      <g transform={`translate(${h.cx}, ${h.cy})`}>
        <HouseIcon fill={colors.fill} stroke={colors.stroke} />
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

export function PlanSVG({ data, highlighted, selected, onSelectHebergement, onSelectBorne, onDeselect }) {
  const transformRef = useRef(null)
  const scaleRef = useRef(0.3)

  useEffect(() => {
    if (!selected || !data || !transformRef.current) return
    let cx, cy
    if (selected.type === 'hebergement') {
      const h = data.hebergements.find(x => x.id === selected.id)
      if (h) { cx = h.cx; cy = h.cy }
    } else if (selected.type === 'borne_eau') {
      const b = data.bornes_eau.find(x => x.id === selected.id)
      if (b) { cx = b.x; cy = b.y }
    } else if (selected.type === 'borne_elec') {
      const b = data.bornes_elec.find(x => x.id === selected.id)
      if (b) { cx = b.x; cy = b.y }
    }
    if (cx === undefined) return
    const scale = scaleRef.current
    const tx = window.innerWidth / 2 - cx * scale
    const ty = window.innerHeight * 0.35 - cy * scale
    transformRef.current.setTransform(tx, ty, scale, 300, 'easeOut')
  }, [selected])

  if (!data) return null

  return (
    <TransformWrapper
      ref={transformRef}
      initialScale={0.3}
      minScale={0.1}
      maxScale={4}
      centerOnInit
      onTransformed={(_, state) => { scaleRef.current = state.scale }}
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
          <image href={`${import.meta.env.BASE_URL}plan_fond.png`}
            x={0} y={0} width={VB_W} height={VB_H}
            opacity={0.5} style={{ pointerEvents: 'none' }} />

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
