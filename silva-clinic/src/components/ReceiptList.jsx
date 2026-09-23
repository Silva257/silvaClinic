import { formatDate, formatUGX } from '../utils/format.js'

export default function ReceiptList({ receipts }) {
  if (!receipts.length) return <p className="muted">No receipts recorded yet.</p>
  const sorted = [...receipts].sort((a, b) => (a.date < b.date ? 1 : -1))
  return (
    <div className="entry-list">
      {sorted.map((r) => (
        <div className="entry-card" key={r.id}>
          <div className="entry-card-header">
            <strong>{formatDate(r.date)}</strong>
            <span className="muted">{r.supplier || 'Supplier not specified'}</span>
          </div>
          <ul className="entry-sub-list">
            {r.items.map((it, i) => (
              <li key={i}>
                {it.name} x{it.qty} - {formatUGX(it.cost)}
              </li>
            ))}
          </ul>
          <div className="entry-card-footer">
            <span>Total cost: {formatUGX(r.totalCost)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
