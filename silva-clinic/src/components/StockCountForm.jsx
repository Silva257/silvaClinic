import { useState } from 'react'
import { genId, todayStr, stockCountsApi } from '../utils/storage.js'

export default function StockCountForm({ stockItems, onAdded }) {
  const [label, setLabel] = useState('Weekly')
  const [date, setDate] = useState(todayStr())
  const [counts, setCounts] = useState({})

  function update(itemId, value) {
    setCounts((prev) => ({ ...prev, [itemId]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const record = {
      id: genId(),
      date,
      label,
      counts: stockItems
        .filter((it) => counts[it.id] !== undefined && counts[it.id] !== '')
        .map((it) => ({ itemId: it.id, name: it.name, countedQty: Number(counts[it.id]) })),
    }
    stockCountsApi.add(record)
    setCounts({})
    onAdded?.(record)
  }

  if (!stockItems.length) {
    return <p className="muted">Add stock items first before recording a count.</p>
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>Record stock count</h3>
      <div className="form-row">
        <label>
          Type
          <select className="input" value={label} onChange={(e) => setLabel(e.target.value)}>
            <option>Weekly</option>
            <option>Annual</option>
            <option>Custom</option>
          </select>
        </label>
        <label>
          Date
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      <div className="line-items">
        {stockItems.map((it) => (
          <div className="line-item-row" key={it.id}>
            <span className="count-label">{it.name}</span>
            <input
              className="input input-amount"
              type="number"
              placeholder={`Counted (system: ${it.quantity})`}
              value={counts[it.id] || ''}
              onChange={(e) => update(it.id, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          Save count
        </button>
      </div>
    </form>
  )
}
