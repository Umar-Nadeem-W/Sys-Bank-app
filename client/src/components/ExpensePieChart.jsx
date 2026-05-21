import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

const fmt = (v) => `PKR ${v.toLocaleString()}`

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div style={{
      background: '#0d1b2e',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: 13,
    }}>
      <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 2 }}>{name}</div>
      <div style={{ color: '#94a3b8' }}>{fmt(value)}</div>
    </div>
  )
}

const renderLegend = (props) => {
  const { payload } = props
  return (
    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {payload.map((entry, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <span style={{
            display: 'inline-block', width: 10, height: 10,
            borderRadius: '50%', background: entry.color, flexShrink: 0,
          }} />
          <span style={{ color: '#94a3b8', flex: 1 }}>{entry.value}</span>
          <span style={{ color: '#f1f5f9', fontWeight: 500 }}>
            {((entry.payload.value / payload.reduce((s, e) => s + e.payload.value, 0)) * 100).toFixed(1)}%
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function ExpensePieChart({ data }) {
  if (!data?.length) return null
  return (
    <div className="card" style={{ gridColumn: 'span 1' }}>
      <div className="card-title">Expense Breakdown (Annual)</div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="40%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            content={renderLegend}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
