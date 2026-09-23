import { useState } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { genId, todayStr } from '../utils/storage.js'

const PERSON_OPTIONS = ['Patient (self)', 'Father', 'Mother', 'Child', 'Other']

function LineItems({ label, items, setItems, placeholder }) {
  function update(i, field, value) {
    const next = items.slice()
    next[i] = { ...next[i], [field]: value }
    setItems(next)
  }
  function add() {
    setItems([...items, { description: '', amount: '' }])
  }
  function remove(i) {
    setItems(items.filter((_, idx) => idx !== i))
  }
  return (
    <div className="line-items">
      <div className="line-items-header">
        <span>{label}</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={add}>
          <FaPlus /> Add
        </button>
      </div>
      {items.map((it, i) => (
        <div className="line-item-row" key={i}>
          <input
            className="input"
            placeholder={placeholder}
            value={it.description}
            onChange={(e) => update(i, 'description', e.target.value)}
          />
          <input
            className="input input-amount"
            type="number"
            placeholder="Amount"
            value={it.amount}
            onChange={(e) => update(i, 'amount', e.target.value)}
          />
          <button type="button" className="icon-btn" onClick={() => remove(i)}>
            <FaTrash />
          </button>
        </div>
      ))}
    </div>
  )
}

export default function EntryForm({ onSubmit, onCancel }) {
  const [date, setDate] = useState(todayStr())
  const [person, setPerson] = useState(PERSON_OPTIONS[0])
  const [items, setItems] = useState([])
  const [labTests, setLabTests] = useState([])
  const [woundDesc, setWoundDesc] = useState('')
  const [woundAmount, setWoundAmount] = useState('')
  const [condition, setCondition] = useState('')
  const [payment, setPayment] = useState('')
  const [note, setNote] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const entry = {
      id: genId(),
      date,
      person,
      items: items.filter((i) => i.description || i.amount).map((i) => ({ ...i, amount: Number(i.amount) || 0 })),
      labTests: labTests.filter((i) => i.description || i.amount).map((i) => ({ ...i, amount: Number(i.amount) || 0 })),
      wound: woundDesc || woundAmount ? { description: woundDesc, amount: Number(woundAmount) || 0 } : null,
      condition: condition.trim(),
      payment: Number(payment) || 0,
      note: note.trim(),
    }
    onSubmit(entry)
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>Add today's visit</h3>
      <div className="form-row">
        <label>
          Date
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>
          Who came
          <select className="input" value={person} onChange={(e) => setPerson(e.target.value)}>
            {PERSON_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>

      <LineItems label="Drugs / acts done" items={items} setItems={setItems} placeholder="e.g. Amoxicillin syrup" />
      <LineItems label="Lab tests (if done)" items={labTests} setItems={setLabTests} placeholder="e.g. Malaria test" />

      <div className="form-row">
        <label>
          Wound treatment (if any)
          <input className="input" value={woundDesc} onChange={(e) => setWoundDesc(e.target.value)} placeholder="Describe the wound/dressing" />
        </label>
        <label>
          Wound cost
          <input className="input" type="number" value={woundAmount} onChange={(e) => setWoundAmount(e.target.value)} />
        </label>
      </div>

      <div className="form-row">
        <label>
          Condition / dose (if on a course, e.g. Typhoid)
          <input className="input" value={condition} onChange={(e) => setCondition(e.target.value)} />
        </label>
        <label>
          Payment made today
          <input className="input" type="number" value={payment} onChange={(e) => setPayment(e.target.value)} />
        </label>
      </div>

      <label>
        Note (optional)
        <input className="input" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save visit
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
