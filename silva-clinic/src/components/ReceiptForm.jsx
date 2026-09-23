import { useState } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { genId, todayStr, receiptsApi, stockApi } from '../utils/storage.js'

export default function ReceiptForm({ stockItems, onAdded }) {
  const [date, setDate] = useState(todayStr())
  const [supplier, setSupplier] = useState('')
  const [lines, setLines] = useState([{ itemId: stockItems[0]?.id || '', qty: '', cost: '' }])

  function updateLine(i, field, value) {
    const next = lines.slice()
    next[i] = { ...next[i], [field]: value }
    setLines(next)
  }
  function addLine() {
    setLines([...lines, { itemId: stockItems[0]?.id || '', qty: '', cost: '' }])
  }
  function removeLine(i) {
    setLines(lines.filter((_, idx) => idx !== i))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const items = lines
      .filter((l) => l.itemId && l.qty)
      .map((l) => {
        const item = stockItems.find((it) => it.id === l.itemId)
        return { itemId: l.itemId, name: item?.name || '', qty: Number(l.qty) || 0, cost: Number(l.cost) || 0 }
      })
    if (!items.length) return
    const totalCost = items.reduce((s, i) => s + i.cost, 0)
    receiptsApi.add({ id: genId(), date, supplier: supplier.trim(), items, totalCost })

    // increase stock quantities to reflect the delivery
    items.forEach((line) => {
      stockApi.update(line.itemId, (it) => ({ ...it, quantity: it.quantity + line.qty }))
    })

    setLines([{ itemId: stockItems[0]?.id || '', qty: '', cost: '' }])
    setSupplier('')
    onAdded?.()
  }

  if (!stockItems.length) return <p className="muted">Add stock items first before recording a receipt.</p>

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>Add order receipt</h3>
      <div className="form-row">
        <label>
          Date
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>
          Supplier
          <input className="input" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
        </label>
      </div>
      <div className="line-items">
        <div className="line-items-header">
          <span>Items received</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={addLine}>
            <FaPlus /> Add line
          </button>
        </div>
        {lines.map((line, i) => (
          <div className="line-item-row" key={i}>
            <select className="input" value={line.itemId} onChange={(e) => updateLine(i, 'itemId', e.target.value)}>
              {stockItems.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name}
                </option>
              ))}
            </select>
            <input
              className="input input-amount"
              type="number"
              placeholder="Qty"
              value={line.qty}
              onChange={(e) => updateLine(i, 'qty', e.target.value)}
            />
            <input
              className="input input-amount"
              type="number"
              placeholder="Cost"
              value={line.cost}
              onChange={(e) => updateLine(i, 'cost', e.target.value)}
            />
            <button type="button" className="icon-btn" onClick={() => removeLine(i)}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          Save receipt
        </button>
      </div>
    </form>
  )
}
