import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
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
      <div style={{ color: '#10b981' }}>Balance: PKR {payload[0].value.toLocaleString()}</div>
    </div>
  )
}

export default function SavingsBarChart({ data }) {
  if (!data?.length) return null

  const maxVal = Math.max(...data.map(d => d.balance))

  return (
    <div className="card">
      <div className="card-title">Savings Account Balance — Month on Month</div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barSize={28} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="balance" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.balance === maxVal ? '#10b981' : '#1e4d6b'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
