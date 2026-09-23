import { Link } from 'react-router-dom'
import { patientsApi } from '../utils/storage.js'
import { getDosingGroups, getPatientBalance } from '../utils/patientCalc.js'
import { formatUGX } from '../utils/format.js'

export default function Dosing() {
  const patients = patientsApi.getAll()
  const groups = getDosingGroups(patients)

  return (
    <div>
      <h2>Dosing / courses</h2>
      <p className="muted">Every visit where you specified a condition (e.g. Typhoid) shows up here, grouped by patient.</p>

      {groups.length === 0 ? (
        <p className="muted">No dosing/course records yet. Add a "condition" when logging a patient's visit.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Condition</th>
              <th>Visits</th>
              <th>Total billed</th>
              <th>Total paid</th>
              <th>Balance for this course</th>
              <th>On overall debt list?</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => {
              const patient = patients.find((p) => p.id === g.patientId)
              const overallDebt = patient ? getPatientBalance(patient) : 0
              return (
                <tr key={g.patientId + g.condition}>
                  <td>
                    <Link to={`/patients/${g.patientId}`}>{g.patientName}</Link>
                  </td>
                  <td>{g.condition}</td>
                  <td>{g.entries.length}</td>
                  <td>{formatUGX(g.billed)}</td>
                  <td>{formatUGX(g.paid)}</td>
                  <td>{formatUGX(g.balance)}</td>
                  <td>{overallDebt > 0 ? `Yes - ${formatUGX(overallDebt)}` : 'No'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
