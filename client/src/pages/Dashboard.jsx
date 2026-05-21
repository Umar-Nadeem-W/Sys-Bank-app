import { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import StatCard from '../components/StatCard'
import ExpensePieChart from '../components/ExpensePieChart'
import SavingsBarChart from '../components/SavingsBarChart'

const PKR = (v) => `PKR ${Number(v).toLocaleString()}`

const TrendUpIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 7l-8.5 8.5-5-5L2 17" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 7h6v6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const WalletIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M20 12V8H6a2 2 0 01-2-2V6a2 2 0 012-2h14v4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="2" y="6" width="20" height="14" rx="2" stroke={color} strokeWidth="2" />
    <circle cx="17" cy="13" r="1.5" fill={color} />
  </svg>
)

const ReceiptIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [monthlySavings, setMonthlySavings] = useState([])
  const [expenseCategories, setExpenseCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/dashboard/summary'),
      axios.get('/api/dashboard/monthly-savings'),
      axios.get('/api/dashboard/expense-categories'),
    ]).then(([s, ms, ec]) => {
      setSummary(s.data)
      setMonthlySavings(ms.data)
      setExpenseCategories(ec.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>◌</div>
          <div>Loading dashboard…</div>
        </div>
      </div>
    )
  }

  const netSavingsRate = summary
    ? (((summary.monthlyIncome - summary.totalExpenses / 12) / summary.monthlyIncome) * 100).toFixed(1)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header user={summary?.user} />

      <main style={{ flex: 1, padding: '32px 32px 48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>

        {/* Page heading */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.4px' }}>
            Financial Overview
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
            Fiscal Year 2024 · {summary?.user?.accountNumber}
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
          <StatCard
            label="Annual Income"
            value={PKR(summary?.monthlyIncome * 12)}
            sub="PKR 5,500 / month"
            accent="#10b981"
            icon={<TrendUpIcon color="#10b981" />}
          />
          <StatCard
            label="Total Expenses (YTD)"
            value={PKR(summary?.totalExpenses)}
            sub={`Avg PKR ${Math.round(summary?.totalExpenses / 12).toLocaleString()} / month`}
            accent="#ef4444"
            icon={<ReceiptIcon color="#ef4444" />}
          />
          <StatCard
            label="Current Savings Balance"
            value={PKR(summary?.currentSavings)}
            sub={`${netSavingsRate}% net savings rate`}
            accent="#3b82f6"
            icon={<WalletIcon color="#3b82f6" />}
          />
        </div>

        {/* Pie + Savings Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20, marginBottom: 24 }}>
          <ExpensePieChart data={expenseCategories} />
          <SavingsBarChart data={monthlySavings} />
        </div>

      </main>
    </div>
  )
}
