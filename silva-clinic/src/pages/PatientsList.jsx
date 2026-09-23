import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import { patientsApi } from '../utils/storage.js'
import { getPatientBalance, getLastActivityDate } from '../utils/patientCalc.js'
import { formatDate, daysSince } from '../utils/format.js'
import DebtBadge from '../components/DebtBadge.jsx'
import SortBar from '../components/SortBar.jsx'
import PatientForm from '../components/PatientForm.jsx'

function matchesSearch(patient, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const names = [patient.name, ...(patient.aliases || [])]
  return names.some((n) => n.toLowerCase().includes(q))
}

export default function PatientsList() {
  const [refresh, setRefresh] = useState(0)
  const [sort, setSort] = useState('debt-desc')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const patients = patientsApi.getAll()

  const rows = useMemo(() => {
    let list = patients.map((p) => ({
      patient: p,
      balance: getPatientBalance(p),
      lastActivity: getLastActivityDate(p),
    }))

    list = list.filter((r) => matchesSearch(r.patient, search))

    switch (sort) {
      case 'debt-desc':
        list.sort((a, b) => b.balance - a.balance)
        break
      case 'debt-asc':
        list.sort((a, b) => a.balance - b.balance)
        break
      case 'date-desc':
        list.sort((a, b) => (a.lastActivity < b.lastActivity ? 1 : -1))
        break
      case 'date-asc':
        list.sort((a, b) => (a.lastActivity > b.lastActivity ? 1 : -1))
        break
      case 'stale':
        list = list
          .filter((r) => r.balance > 0)
          .sort((a, b) => daysSince(b.lastActivity) - daysSince(a.lastActivity))
        break
      default:
        break
    }
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patients, sort, search, refresh])

  const editingPatient = editingId ? patientsApi.getById(editingId) : null

  return (
    <div>
      <div className="page-header">
        <h2>Patients</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingId(null)
            setShowForm((s) => !s)
          }}
        >
          <FaPlus /> {showForm && !editingId ? 'Close' : 'Register patient'}
        </button>
      </div>

      {showForm && !editingId && (
        <PatientForm
          onAdded={() => {
            setShowForm(false)
            setRefresh((r) => r + 1)
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingPatient && (
        <PatientForm
          patient={editingPatient}
          onAdded={() => {
            setEditingId(null)
            setRefresh((r) => r + 1)
          }}
          onCancel={() => setEditingId(null)}
        />
      )}

      <SortBar value={sort} onChange={setSort} search={search} onSearchChange={setSearch} />

      {rows.length === 0 ? (
        <p className="muted">No patients match. {sort === 'stale' && 'No one is overdue right now.'}</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Also known as</th>
              <th>Last visit</th>
              <th>Days since</th>
              <th>Balance</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ patient, balance, lastActivity }) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td className="muted">{(patient.aliases || []).join(', ') || '-'}</td>
                <td>{formatDate(lastActivity)}</td>
                <td>{daysSince(lastActivity) ?? '-'}</td>
                <td>
                  <DebtBadge balance={balance} />
                </td>
                <td className="row-actions">
                  <Link className="btn btn-ghost btn-sm" to={`/patients/${patient.id}`}>
                    Open
                  </Link>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(patient.id)
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
