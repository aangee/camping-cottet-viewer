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

function HebergementMarker({ h, isHighlighted, onClick }) {
  const colors = TYPE_COLORS[h.type] ?? { fill: '#1f2937', stroke: '#6b7280' }
  return (
    <g
      className={isHighlighted ? 'marker-highlighted' : ''}
      style={{ cursor: 'pointer' }}
      onClick={(e) => { e.stopPropagation(); onClick(h.id) }}
    >
      {isHighlighted && (
        <circle className="pulse-ring" cx={h.cx} cy={h.cy} r={18}
          fill="none" stroke={colors.stroke} strokeWidth={2.5} opacity={0.9} />
      )}
      <circle cx={h.cx} cy={h.cy} r={14}
        fill={colors.fill} stroke={colors.stroke} strokeWidth={2} />
      <text x={h.cx} y={h.cy} textAnchor="middle" dominantBaseline="central"
        fontSize={10} fontWeight="700" fill={colors.stroke}
        fontFamily="'Courier New', monospace" pointerEvents="none">
        {h.nom}
      </text>
    </g>
  )
}

function BorneMarker({ b, color, darkColor, isHighlighted, onClick }) {
  return (
    <g
      className={isHighlighted ? 'marker-highlighted' : ''}
      style={{ cursor: 'pointer' }}
      onClick={(e) => { e.stopPropagation(); onClick(b.id) }}
    >
      {isHighlighted && (
        <circle className="pulse-ring" cx={b.x} cy={b.y} r={18}
          fill="none" stroke={color} strokeWidth={2.5} opacity={0.9} />
      )}
      <circle cx={b.x} cy={b.y} r={14} fill={darkColor} stroke={color} strokeWidth={2} />
      <circle cx={b.x} cy={b.y} r={5} fill={color} />
      <text x={b.x} y={b.y + 26} textAnchor="middle" fontSize={9} fontWeight="700"
        fill={color} fontFamily="'Courier New', monospace" pointerEvents="none">
        {b.num}
      </text>
    </g>
  )
}

export function PlanSVG({ data, highlighted, onSelectHebergement, onSelectBorne, onDeselect }) {
  if (!data) return null

  return (
    <TransformWrapper
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
            <BorneMarker
              key={b.id}
              b={b}
              color="#38bdf8"
              darkColor="#0c4a6e"
              isHighlighted={highlighted.bornes_eau.has(b.id)}
              onClick={(id) => onSelectBorne('borne_eau', id)}
            />
          ))}

          {data.bornes_elec.map(b => (
            <BorneMarker
              key={b.id}
              b={b}
              color="#fbbf24"
              darkColor="#451a03"
              isHighlighted={highlighted.bornes_elec.has(b.id)}
              onClick={(id) => onSelectBorne('borne_elec', id)}
            />
          ))}
        </svg>
      </TransformComponent>
    </TransformWrapper>
  )
}
