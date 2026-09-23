import { useState } from 'react'
import { genId, stockApi } from '../utils/storage.js'

export default function StockItemForm({ onAdded }) {
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('pieces')
  const [quantity, setQuantity] = useState('0')
  const [reorderLevel, setReorderLevel] = useState('5')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    const item = {
      id: genId(),
      name: name.trim(),
      unit,
      quantity: Number(quantity) || 0,
      reorderLevel: Number(reorderLevel) || 0,
    }
    stockApi.add(item)
    setName('')
    setQuantity('0')
    onAdded?.(item)
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>Add stock item</h3>
      <div className="form-row">
        <label>
          Drug / item name
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Unit
          <input className="input" value={unit} onChange={(e) => setUnit(e.target.value)} />
        </label>
      </div>
      <div className="form-row">
        <label>
          Initial quantity
          <input className="input" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </label>
        <label>
          Reorder level
          <input className="input" type="number" value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} />
        </label>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          Add item
        </button>
      </div>
    </form>
  )
}
