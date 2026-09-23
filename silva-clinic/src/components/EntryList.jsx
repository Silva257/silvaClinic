import { entryCharge } from '../utils/patientCalc.js'
import { formatUGX, formatDate } from '../utils/format.js'

export default function EntryList({ entries }) {
  if (!entries.length) {
    return <p className="muted">No visits recorded yet.</p>
  }
  const sorted = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1))
  return (
    <div className="entry-list">
      {sorted.map((e) => (
        <div className="entry-card" key={e.id}>
          <div className="entry-card-header">
            <strong>{formatDate(e.date)}</strong>
            <span className="muted">{e.person}</span>
            {e.condition && <span className="badge badge-mid">{e.condition}</span>}
          </div>
          {e.items?.length > 0 && (
            <ul className="entry-sub-list">
              {e.items.map((it, i) => (
                <li key={i}>
                  {it.description} - {formatUGX(it.amount)}
                </li>
              ))}
            </ul>
          )}
          {e.labTests?.length > 0 && (
            <div className="entry-tag-block">
              <span className="tag">Lab tests</span>
              <ul className="entry-sub-list">
                {e.labTests.map((it, i) => (
                  <li key={i}>
                    {it.description} - {formatUGX(it.amount)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {e.wound && (
            <div className="entry-tag-block">
              <span className="tag">Wound treatment</span>
              <p>
                {e.wound.description} - {formatUGX(e.wound.amount)}
              </p>
            </div>
          )}
          {e.note && <p className="muted">Note: {e.note}</p>}
          <div className="entry-card-footer">
            <span>Charged: {formatUGX(entryCharge(e))}</span>
            <span>Paid: {formatUGX(e.payment)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
