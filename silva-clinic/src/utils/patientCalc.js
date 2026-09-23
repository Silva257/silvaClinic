export function entryCharge(entry) {
  const items = (entry.items || []).reduce((s, i) => s + Number(i.amount || 0), 0)
  const labs = (entry.labTests || []).reduce((s, i) => s + Number(i.amount || 0), 0)
  const wound = entry.wound ? Number(entry.wound.amount || 0) : 0
  return items + labs + wound
}

export function getPatientBalance(patient) {
  let balance = Number(patient.openingBalance || 0)
  ;(patient.entries || []).forEach((e) => {
    balance += entryCharge(e)
    balance -= Number(e.payment || 0)
  })
  return balance
}

export function getPatientTotalBilled(patient) {
  return (patient.entries || []).reduce((s, e) => s + entryCharge(e), 0) + Number(patient.openingBalance || 0)
}

export function getPatientTotalPaid(patient) {
  return (patient.entries || []).reduce((s, e) => s + Number(e.payment || 0), 0)
}

export function getLastActivityDate(patient) {
  const entries = patient.entries || []
  if (!entries.length) return patient.createdAt
  return entries.reduce((latest, e) => (e.date > latest ? e.date : latest), entries[0].date)
}

// Returns all { patient, condition, entries, billed, paid, balance } groups
// across every patient, for the dosing/course tracker page.
export function getDosingGroups(patients) {
  const groups = {}
  patients.forEach((p) => {
    ;(p.entries || []).forEach((e) => {
      if (!e.condition) return
      const key = p.id + '::' + e.condition
      if (!groups[key]) {
        groups[key] = { patientId: p.id, patientName: p.name, condition: e.condition, entries: [], billed: 0, paid: 0 }
      }
      groups[key].entries.push(e)
      groups[key].billed += entryCharge(e)
      groups[key].paid += Number(e.payment || 0)
    })
  })
  return Object.values(groups).map((g) => ({ ...g, balance: g.billed - g.paid }))
}
