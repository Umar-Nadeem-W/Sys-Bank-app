export default function StatCard({ label, value, sub, accent = '#10b981', icon }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </span>
        {icon && (
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `${accent}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: '#64748b' }}>{sub}</div>
      )}
    </div>
  )
}
