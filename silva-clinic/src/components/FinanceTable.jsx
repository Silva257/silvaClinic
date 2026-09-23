import { FaTrash } from 'react-icons/fa'
import { financeApi } from '../utils/storage.js'
import { formatDate, formatUGX } from '../utils/format.js'

export default function FinanceTable({ records, onChanged }) {
  function remove(id) {
    if (!confirm('Delete this record?')) return
    financeApi.remove(id)
    onChanged?.()
  }

  if (!records.length) return <p className="muted">No income/expense records yet.</p>

  const sorted = [...records].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Description</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((r) => (
          <tr key={r.id}>
            <td>{formatDate(r.date)}</td>
            <td>
              <span className={`badge ${r.type === 'income' ? 'badge-clear' : 'badge-high'}`}>
                {r.type === 'income' ? 'Income' : 'Expense'}
              </span>
            </td>
            <td>{r.description}</td>
            <td>{formatUGX(r.amount)}</td>
            <td>
              <button className="icon-btn" onClick={() => remove(r.id)}>
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
