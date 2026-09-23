import { useMemo, useState } from 'react'
import { financeApi, todayStr } from '../utils/storage.js'
import { formatUGX } from '../utils/format.js'
import StatCard from '../components/StatCard.jsx'
import FinanceForm from '../components/FinanceForm.jsx'
import FinanceTable from '../components/FinanceTable.jsx'
import { FaArrowUp, FaArrowDown, FaBalanceScale } from 'react-icons/fa'

export default function Finance() {
  const [refresh, setRefresh] = useState(0)
  const records = financeApi.getAll()

  const totals = useMemo(() => {
    const today = todayStr()
    const todays = records.filter((r) => r.date === today)
    const income = todays.filter((r) => r.type === 'income').reduce((s, r) => s + r.amount, 0)
    const expense = todays.filter((r) => r.type === 'expense').reduce((s, r) => s + r.amount, 0)
    return { income, expense, net: income - expense }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, refresh])

  return (
    <div key={refresh}>
      <h2>Daily money in / out</h2>
      <div className="stat-grid">
        <StatCard icon={<FaArrowUp />} label="Income today" value={formatUGX(totals.income)} />
        <StatCard icon={<FaArrowDown />} label="Expenses today" value={formatUGX(totals.expense)} tone="warning" />
        <StatCard icon={<FaBalanceScale />} label="Net today" value={formatUGX(totals.net)} />
      </div>
      <FinanceForm onAdded={() => setRefresh((r) => r + 1)} />
      <FinanceTable records={records} onChanged={() => setRefresh((r) => r + 1)} />
    </div>
  )
}
