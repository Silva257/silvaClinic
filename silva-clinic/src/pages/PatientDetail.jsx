import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaArrowLeft, FaTrash, FaEdit } from 'react-icons/fa'
import { patientsApi } from '../utils/storage.js'
import { getPatientBalance, getPatientTotalBilled, getPatientTotalPaid } from '../utils/patientCalc.js'
import { formatUGX, formatDate } from '../utils/format.js'
import DebtBadge from '../components/DebtBadge.jsx'
import EntryForm from '../components/EntryForm.jsx'
import EntryList from '../components/EntryList.jsx'
import PatientForm from '../components/PatientForm.jsx'

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [refresh, setRefresh] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(false)

  const patient = patientsApi.getById(id)

  if (!patient) {
    return (
      <div>
        <p>Patient not found.</p>
        <Link to="/patients">Back to patients</Link>
      </div>
    )
  }

  const balance = getPatientBalance(patient)

  function addEntry(entry) {
    patientsApi.update(patient.id, (p) => ({ ...p, entries: [...(p.entries || []), entry] }))
    setShowForm(false)
    setRefresh((r) => r + 1)
  }

  function deletePatient() {
    if (!confirm(`Delete ${patient.name} and all their records?`)) return
    patientsApi.remove(patient.id)
    navigate('/patients')
  }

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/patients')}>
        <FaArrowLeft /> Back
      </button>

      <div className="page-header">
        <div>
          <h2>{patient.name}</h2>
          {patient.aliases?.length > 0 && (
            <p className="muted">Also known as: {patient.aliases.join(', ')}</p>
          )}
          <p className="muted">{patient.phone || 'No phone on file'} &middot; registered {formatDate(patient.createdAt)}</p>
        </div>
        <div className="row-actions">
          <button className="icon-btn" title="Edit patient" onClick={() => setEditing((e) => !e)}>
            <FaEdit />
          </button>
          <button className="icon-btn" title="Delete patient" onClick={deletePatient}>
            <FaTrash />
          </button>
        </div>
      </div>

      {editing && (
        <PatientForm
          patient={patient}
          onAdded={() => {
            setEditing(false)
            setRefresh((r) => r + 1)
          }}
          onCancel={() => setEditing(false)}
        />
      )}

      <div className="stat-grid">
        <div className="card">
          <div className="stat-label">Current balance</div>
          <DebtBadge balance={balance} />
        </div>
        <div className="card">
          <div className="stat-label">Total billed</div>
          <div className="stat-value">{formatUGX(getPatientTotalBilled(patient))}</div>
        </div>
        <div className="card">
          <div className="stat-label">Total paid</div>
          <div className="stat-value">{formatUGX(getPatientTotalPaid(patient))}</div>
        </div>
      </div>

      <div className="page-header">
        <h3>Visit history</h3>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Close' : 'Add visit'}
        </button>
      </div>

      {showForm && <EntryForm onSubmit={addEntry} onCancel={() => setShowForm(false)} />}

      <EntryList entries={patient.entries || []} key={refresh} />
    </div>
  )
}
