import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Dashboard from './pages/Dashboard'
import PredictiveFinance from './pages/PredictiveFinance'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Dashboard />} />
        <Route path="/predictive" element={<PredictiveFinance />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
