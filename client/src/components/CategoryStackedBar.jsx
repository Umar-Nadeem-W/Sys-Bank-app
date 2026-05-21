import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'

const CATEGORIES = ['Rent', 'Utilities', 'Taxes', 'Groceries', 'Health', 'Entertainment', 'Transport']
const COLORS = ['#3b82f6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#8b5cf6']

const fmt = (v) => `PKR ${(v / 1000).toFixed(1)}k`

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + (p.value || 0), 0)
  return (
    <div style={{
      background: '#0d1b2e',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10,
      padding: '12px 16px',
      fontSize: 12,
      minWidth: 160,
    }}>
      <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, color: '#94a3b8', marginBottom: 3 }}>
          <span style={{ color: p.fill }}>{p.name}</span>
          <span style={{ color: '#f1f5f9' }}>PKR {p.value.toLocaleString()}</span>
        </div>
      ))}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#f1f5f9' }}>
        <span>Total</span>
        <span>PKR {total.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default function CategoryStackedBar({ data }) {
  if (!data?.length) return null
  return (
    <div className="card" style={{ gridColumn: 'span 2' }}>
      <div className="card-title">Monthly Expense Breakdown by Category</div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={22} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
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
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
            formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
          />
          {CATEGORIES.map((cat, i) => (
            <Bar key={cat} dataKey={cat} stackId="a" fill={COLORS[i]}
              radius={i === CATEGORIES.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
