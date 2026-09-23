import { useState } from 'react'
import { lendingApi } from '../utils/storage.js'
import LendingForm from '../components/LendingForm.jsx'
import LendingTable from '../components/LendingTable.jsx'

export default function Lending() {
  const [refresh, setRefresh] = useState(0)
  const records = lendingApi.getAll()

  return (
    <div key={refresh}>
      <h2>Borrowing &amp; lending with partner shops</h2>
      <p className="muted">Trinity, Ave Maria, Muzizi DS, Joshua Clinic - mark a record as returned/cleared once it's settled.</p>
      <LendingForm onAdded={() => setRefresh((r) => r + 1)} />
      <LendingTable records={records} onChanged={() => setRefresh((r) => r + 1)} />
    </div>
  )
}
