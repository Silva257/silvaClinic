import { useState } from 'react'
import { genId, todayStr, financeApi } from '../utils/storage.js'

export default function FinanceForm({ onAdded }) {
  const [date, setDate] = useState(todayStr())
  const [type, setType] = useState('income')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!description.trim() || !amount) return
    financeApi.add({ id: genId(), date, type, description: description.trim(), amount: Number(amount) || 0 })
    setDescription('')
    setAmount('')
    onAdded?.()
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>Record money in / out</h3>
      <div className="form-row">
        <label>
          Date
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>
          Type
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income received</option>
            <option value="expense">Expense</option>
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          Description
          <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label>
          Amount
          <input className="input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </label>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </div>
    </form>
  )
}
