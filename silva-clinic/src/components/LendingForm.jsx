import { useState } from 'react'
import { genId, todayStr, lendingApi, PARTNER_SHOPS } from '../utils/storage.js'

export default function LendingForm({ onAdded }) {
  const [date, setDate] = useState(todayStr())
  const [shopName, setShopName] = useState(PARTNER_SHOPS[0])
  const [customShop, setCustomShop] = useState('')
  const [direction, setDirection] = useState('borrowed')
  const [drugName, setDrugName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!drugName.trim() || !quantity) return
    const record = {
      id: genId(),
      date,
      shopName: shopName === 'Other' ? customShop.trim() : shopName,
      direction,
      drugName: drugName.trim(),
      quantity: Number(quantity) || 0,
      returned: false,
      returnedDate: null,
      note: note.trim(),
    }
    lendingApi.add(record)
    setDrugName('')
    setQuantity('')
    setNote('')
    onAdded?.()
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>Record borrowing / lending</h3>
      <div className="form-row">
        <label>
          Date
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>
          Direction
          <select className="input" value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="borrowed">We borrowed from them</option>
            <option value="lent">We lent to them</option>
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          Shop
          <select className="input" value={shopName} onChange={(e) => setShopName(e.target.value)}>
            {PARTNER_SHOPS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </label>
        {shopName === 'Other' && (
          <label>
            Shop name
            <input className="input" value={customShop} onChange={(e) => setCustomShop(e.target.value)} />
          </label>
        )}
      </div>
      <div className="form-row">
        <label>
          Drug name
          <input className="input" value={drugName} onChange={(e) => setDrugName(e.target.value)} required />
        </label>
        <label>
          Quantity
          <input className="input" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        </label>
      </div>
      <label>
        Note (optional)
        <input className="input" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          Save record
        </button>
      </div>
    </form>
  )
}
