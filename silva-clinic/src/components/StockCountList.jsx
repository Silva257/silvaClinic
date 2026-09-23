import { formatDate } from '../utils/format.js'

export default function StockCountList({ counts }) {
  if (!counts.length) return <p className="muted">No stock counts recorded yet.</p>
  const sorted = [...counts].sort((a, b) => (a.date < b.date ? 1 : -1))
  return (
    <div className="entry-list">
      {sorted.map((c) => (
        <div className="entry-card" key={c.id}>
          <div className="entry-card-header">
            <strong>{formatDate(c.date)}</strong>
            <span className="badge badge-mid">{c.label}</span>
          </div>
          <ul className="entry-sub-list">
            {c.counts.map((item, i) => (
              <li key={i}>
                {item.name}: {item.countedQty}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
