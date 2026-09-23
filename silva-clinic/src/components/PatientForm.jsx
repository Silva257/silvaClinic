import { useState } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { genId, todayStr, patientsApi } from '../utils/storage.js'

// Used both to register a new patient/family AND to edit an existing one.
// Pass an existing `patient` to edit it in place; omit it to create a new one.
export default function PatientForm({ patient, onAdded, onCancel }) {
  const isEdit = !!patient
  const [name, setName] = useState(patient?.name || '')
  const [aliases, setAliases] = useState(patient?.aliases?.length ? patient.aliases : [''])
  const [phone, setPhone] = useState(patient?.phone || '')
  const [openingBalance, setOpeningBalance] = useState(String(patient?.openingBalance ?? '0'))

  function updateAlias(i, value) {
    const next = aliases.slice()
    next[i] = value
    setAliases(next)
  }
  function addAlias() {
    setAliases([...aliases, ''])
  }
  function removeAlias(i) {
    setAliases(aliases.filter((_, idx) => idx !== i))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    const cleanAliases = [...new Set(aliases.map((a) => a.trim()).filter(Boolean))]

    if (isEdit) {
      patientsApi.update(patient.id, (p) => ({
        ...p,
        name: name.trim(),
        aliases: cleanAliases,
        phone: phone.trim(),
        openingBalance: Number(openingBalance) || 0,
      }))
      onAdded?.()
      return
    }

    const newPatient = {
      id: genId(),
      name: name.trim(),
      aliases: cleanAliases,
      phone: phone.trim(),
      openingBalance: Number(openingBalance) || 0,
      createdAt: todayStr(),
      entries: [],
    }
    patientsApi.add(newPatient)
    onAdded?.(newPatient)
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>{isEdit ? 'Edit patient / family' : 'Register patient / family'}</h3>
      <label>
        Main name
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <div className="line-items">
        <div className="line-items-header">
          <span>Other names for this family/account (e.g. Mama Anick, Muhawe, Baba Emma)</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={addAlias}>
            <FaPlus /> Add name
          </button>
        </div>
        {aliases.map((a, i) => (
          <div className="line-item-row alias-row" key={i}>
            <input
              className="input"
              placeholder="e.g. Mama Anick"
              value={a}
              onChange={(e) => updateAlias(i, e.target.value)}
            />
            <button type="button" className="icon-btn" onClick={() => removeAlias(i)}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <label>
        Phone (optional)
        <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>
      <label>
        Previous debt balance (if any)
        <input
          className="input"
          type="number"
          value={openingBalance}
          onChange={(e) => setOpeningBalance(e.target.value)}
        />
      </label>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEdit ? 'Save changes' : 'Save patient'}
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
