import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import CreditScoreGauge from '../components/CreditScoreGauge'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell,
} from 'recharts'

const PKR = (v) => `PKR ${Number(v).toLocaleString()}`

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0d1b2e',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10,
      padding: '12px 16px',
      fontSize: 13,
    }}>
      <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, marginBottom: 4 }}>
          <span style={{ color: p.fill }}>{p.name}</span>
          <span style={{ color: '#f1f5f9', fontWeight: 500 }}>PKR {p.value.toLocaleString()}</span>
        </div>
      ))}
      {payload.length === 2 && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          marginTop: 8, paddingTop: 8,
          display: 'flex', justifyContent: 'space-between',
          color: '#10b981', fontWeight: 600,
        }}>
          <span>Saved</span>
          <span>PKR {(payload[0].value - payload[1].value).toLocaleString()}</span>
        </div>
      )}
    </div>
  )
}

function SavingsProjectionCard({ plan }) {
  const pctPaid = plan
    ? +((plan.loanAllocation * 12 / plan.loanRemaining) * 100).toFixed(1)
    : 0

  const items = [
    {
      label: 'Monthly Expenses Saved',
      value: PKR(plan?.monthlySaved),
      color: '#10b981',
      note: 'vs. your current average',
    },
    {
      label: 'Monthly Loan Repayment',
      value: PKR(plan?.loanAllocation),
      color: '#3b82f6',
      note: '60% of freed surplus',
    },
    {
      label: 'Monthly Savings Added',
      value: PKR(plan?.savingsAllocation),
      color: '#8b5cf6',
      note: '40% of freed surplus',
    },
    {
      label: 'Loan Cleared Per Year',
      value: PKR(plan?.loanAllocation * 12),
      color: '#f59e0b',
      note: `${pctPaid}% of remaining loan`,
    },
    {
      label: 'Estimated Loan Payoff',
      value: `~${plan?.yearsToPayoff} yrs`,
      color: '#ec4899',
      note: `${plan?.monthsToPayoff} monthly payments`,
    },
  ]

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(59,130,246,0.08) 100%)',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 24,
        border: '1px solid rgba(16,185,129,0.15)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          Following this plan, you will
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
          Save {PKR(plan?.monthlySaved)}
        </div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
          every month vs. your current spending habits
        </div>
      </div>

      {/* Breakdown items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>{item.label}</div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{item.note}</div>
            </div>
            <div style={{
              fontSize: 15, fontWeight: 700, color: item.color,
              background: `${item.color}15`,
              padding: '4px 12px', borderRadius: 8,
              whiteSpace: 'nowrap',
            }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Loan progress bar */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 8 }}>
          <span>Loan cleared annually</span>
          <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{pctPaid}%</span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.min(pctPaid, 100)}%`,
            background: 'linear-gradient(90deg, #3b82f6, #10b981)',
            borderRadius: 99,
            transition: 'width 0.8s ease',
          }} />
        </div>
      </div>
    </div>
  )
}

export default function PredictiveFinance() {
  const navigate = useNavigate()
  const [plan, setPlan] = useState(null)
  const [creditScore, setCreditScore] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/dashboard/predictive'),
      axios.get('/api/dashboard/credit-score'),
    ]).then(([p, cs]) => {
      setPlan(p.data)
      setCreditScore(cs.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(6,13,26,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, color: '#94a3b8',
            padding: '6px 14px', cursor: 'pointer',
            fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          ← Back
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#f1f5f9', letterSpacing: '-0.2px' }}>
            Predictive Finance
          </span>
        </div>
        <div style={{ width: 80 }} />
      </header>

      <main style={{ flex: 1, padding: '36px 32px 48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>

        {/* Page title */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.4px' }}>
            Your Ideal Expense Plan
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
            Based on your income, current spending habits, and outstanding loan — here's what we recommend for next month.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
            <div style={{ textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>◌</div>
              <div>Crunching numbers…</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 24, alignItems: 'start' }}>

            {/* Grouped bar chart */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div className="card-title" style={{ marginBottom: 0 }}>Ideal Expense Plan — Current vs Recommended</div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: '#334d6e' }} />
                    Current
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: '#10b981' }} />
                    Recommended
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart
                  data={plan?.breakdown}
                  barCategoryGap="28%"
                  barGap={4}
                  margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="category"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tickFormatter={v => `PKR ${v}`}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false} tickLine={false}
                    width={72}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="current" name="Current" radius={[4, 4, 0, 0]} fill="#1e4d6b" />
                  <Bar dataKey="ideal"   name="Recommended" radius={[4, 4, 0, 0]} fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>

              {/* Per-category saving chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
                {plan?.breakdown.filter(d => d.saving > 0).map((d, i) => (
                  <div key={i} style={{
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    borderRadius: 20, padding: '3px 12px',
                    fontSize: 12, color: '#10b981',
                  }}>
                    {d.category} −PKR {d.saving.toLocaleString()}
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: credit score + savings projection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <CreditScoreGauge
                score={creditScore?.creditScore}
                rating={creditScore?.rating}
                mae={creditScore?.modelMAE}
                r2={creditScore?.modelR2}
              />
              <SavingsProjectionCard plan={plan} />
            </div>

          </div>
        )}
      </main>
    </div>
  )
}
