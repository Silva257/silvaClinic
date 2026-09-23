import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FaUserInjured, FaMoneyBillWave, FaBoxes, FaExclamationTriangle } from 'react-icons/fa'
import HeroSection from '../components/HeroSection.jsx'
import StatCard from '../components/StatCard.jsx'
import { patientsApi, stockApi, todayStr } from '../utils/storage.js'
import { getPatientBalance, getLastActivityDate } from '../utils/patientCalc.js'
import { formatUGX } from '../utils/format.js'

export default function Home() {
  const patients = patientsApi.getAll()
  const stock = stockApi.getAll()

  const stats = useMemo(() => {
    const today = todayStr()
    const treatedToday = patients.filter((p) => (p.entries || []).some((e) => e.date === today)).length
    const totalDebt = patients.reduce((s, p) => s + Math.max(getPatientBalance(p), 0), 0)
    const lowStock = stock.filter((i) => i.quantity <= i.reorderLevel).length
    return { treatedToday, totalDebt, lowStock }
  }, [patients, stock])

  return (
    <div>
      <HeroSection />
      <div className="stat-grid">
        <StatCard icon={<FaUserInjured />} label="Patients treated today" value={stats.treatedToday} />
        <StatCard icon={<FaMoneyBillWave />} label="Total outstanding debt" value={formatUGX(stats.totalDebt)} tone="warning" />
        <StatCard icon={<FaBoxes />} label="Registered patients" value={patients.length} />
        <StatCard icon={<FaExclamationTriangle />} label="Low stock items" value={stats.lowStock} tone={stats.lowStock ? 'warning' : 'default'} />
      </div>

      <div className="quick-links">
        <Link to="/patients" className="btn btn-primary">
          Go to patients list
        </Link>
        <Link to="/stock" className="btn btn-ghost">
          Manage stock
        </Link>
        <Link to="/dosing" className="btn btn-ghost">
          View dosing / courses
        </Link>
        <Link to="/lending" className="btn btn-ghost">
          Borrow / lend drugs
        </Link>
        <Link to="/finance" className="btn btn-ghost">
          Daily money in/out
        </Link>
      </div>
    </div>
  )
}
