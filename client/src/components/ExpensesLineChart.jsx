import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Dot,
} from 'recharts'

const fmt = (v) => `PKR ${(v / 1000).toFixed(1)}k`

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0d1b2e',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: 13,
    }}>
      <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#3b82f6' }}>Total: PKR {payload[0].value.toLocaleString()}</div>
    </div>
  )
}

export default function ExpensesLineChart({ data }) {
  if (!data?.length) return null

  const enriched = data.map(row => {
    const { month, ...cats } = row
    const total = Object.values(cats).reduce((a, b) => a + b, 0)
    return { month, total }
  })

  const avg = Math.round(enriched.reduce((s, r) => s + r.total, 0) / enriched.length)

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="card-title" style={{ marginBottom: 0 }}>Total Expenses — Month on Month</div>
        <div style={{
          fontSize: 12, color: '#64748b',
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 6,
          padding: '3px 10px',
        }}>
          Avg: PKR {avg.toLocaleString()}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={enriched} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={avg} stroke="rgba(59,130,246,0.3)" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#60a5fa', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
