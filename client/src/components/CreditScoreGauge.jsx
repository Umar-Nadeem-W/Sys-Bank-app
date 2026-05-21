/**
 * CreditScoreGauge
 * SVG half-circle gauge that fills from 300 (min) to 850 (max).
 * Color transitions: red → amber → yellow → green → emerald
 */

const RATING_COLOR = {
  'Excellent': '#10b981',
  'Very Good': '#34d399',
  'Good':      '#a3e635',
  'Fair':      '#facc15',
  'Average':   '#fb923c',
  'Poor':      '#ef4444',
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const x1 = cx + r * Math.cos(toRad(startAngle))
  const y1 = cy + r * Math.sin(toRad(startAngle))
  const x2 = cx + r * Math.cos(toRad(endAngle))
  const y2 = cy + r * Math.sin(toRad(endAngle))
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
}

export default function CreditScoreGauge({ score, rating, maxScore = 850, minScore = 300, mae, r2 }) {
  const START = 180  // left of semicircle
  const END   = 360  // right of semicircle
  const RANGE = END - START

  const pct = (score - minScore) / (maxScore - minScore)
  const fillAngle = START + pct * RANGE

  const cx = 110, cy = 110, r = 90
  const trackPath = describeArc(cx, cy, r, START, END)
  const fillPath  = describeArc(cx, cy, r, START, fillAngle)
  const color = RATING_COLOR[rating] ?? '#facc15'

  return (
    <div className="card">
      <div className="card-title">Credit Score</div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        {/* SVG Gauge */}
        <svg width="220" height="130" viewBox="0 0 220 130" style={{ overflow: 'visible' }}>
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#ef4444" />
              <stop offset="40%"  stopColor="#f59e0b" />
              <stop offset="70%"  stopColor="#a3e635" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Track */}
          <path
            d={trackPath}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Fill */}
          <path
            d={fillPath}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
          />

          {/* Needle dot at tip */}
          {(() => {
            const toRad = (deg) => (deg * Math.PI) / 180
            const nx = cx + r * Math.cos(toRad(fillAngle))
            const ny = cy + r * Math.sin(toRad(fillAngle))
            return <circle cx={nx} cy={ny} r="6" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
          })()}

          {/* Score number */}
          <text x={cx} y={cy + 8} textAnchor="middle" fontSize="32" fontWeight="700" fill="#f1f5f9" fontFamily="Inter, sans-serif">
            {score}
          </text>
          <text x={cx} y={cy + 26} textAnchor="middle" fontSize="13" fontWeight="600" fill={color} fontFamily="Inter, sans-serif">
            {rating}
          </text>

          {/* Min / Max labels */}
          <text x={cx - r - 4} y={cy + 20} textAnchor="middle" fontSize="10" fill="#475569" fontFamily="Inter, sans-serif">{minScore}</text>
          <text x={cx + r + 4} y={cy + 20} textAnchor="middle" fontSize="10" fill="#475569" fontFamily="Inter, sans-serif">{maxScore}</text>
        </svg>

        {/* Scale labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 8 }}>
          {[
            { label: 'Poor',      color: '#ef4444' },
            { label: 'Fair',      color: '#f59e0b' },
            { label: 'Good',      color: '#a3e635' },
            { label: 'Excellent', color: '#10b981' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 10, color: s.color, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />

        {/* Model stats */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#475569' }}>Model MAE</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginTop: 2 }}>±{mae}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#475569' }}>ML Model</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginTop: 2 }}>Gradient Boosting</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#475569' }}>Score Range</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginTop: 2 }}>{minScore}–{maxScore}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
