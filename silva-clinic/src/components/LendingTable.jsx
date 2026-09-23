import { FaCheck, FaTrash } from 'react-icons/fa'
import { lendingApi, todayStr } from '../utils/storage.js'
import { formatDate } from '../utils/format.js'

export default function LendingTable({ records, onChanged }) {
  function markReturned(id) {
    lendingApi.update(id, (r) => ({ ...r, returned: true, returnedDate: todayStr() }))
    onChanged?.()
  }
  function remove(id) {
    if (!confirm('Delete this record?')) return
    lendingApi.remove(id)
    onChanged?.()
  }

  if (!records.length) return <p className="muted">No borrowing/lending records yet.</p>

  const sorted = [...records].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Shop</th>
          <th>Direction</th>
          <th>Drug</th>
          <th>Qty</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((r) => (
          <tr key={r.id} className={!r.returned ? 'row-warning' : ''}>
            <td>{formatDate(r.date)}</td>
            <td>{r.shopName}</td>
            <td>{r.direction === 'borrowed' ? 'Borrowed from them' : 'Lent to them'}</td>
            <td>{r.drugName}</td>
            <td>{r.quantity}</td>
            <td>{r.returned ? `Cleared ${formatDate(r.returnedDate)}` : 'Outstanding'}</td>
            <td className="row-actions">
              {!r.returned && (
                <button className="icon-btn" title="Mark returned/cleared" onClick={() => markReturned(r.id)}>
                  <FaCheck />
                </button>
              )}
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
