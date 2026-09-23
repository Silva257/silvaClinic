import { useState } from 'react'
import { stockApi, stockCountsApi, receiptsApi } from '../utils/storage.js'
import StockItemForm from '../components/StockItemForm.jsx'
import StockTable from '../components/StockTable.jsx'
import StockCountForm from '../components/StockCountForm.jsx'
import StockCountList from '../components/StockCountList.jsx'
import ReceiptForm from '../components/ReceiptForm.jsx'
import ReceiptList from '../components/ReceiptList.jsx'

const TABS = ['Items', 'Weekly / annual counts', 'Order receipts']

export default function Stock() {
  const [tab, setTab] = useState(TABS[0])
  const [refresh, setRefresh] = useState(0)
  const bump = () => setRefresh((r) => r + 1)

  const stockItems = stockApi.getAll()
  const stockCounts = stockCountsApi.getAll()
  const receipts = receiptsApi.getAll()

  return (
    <div key={refresh}>
      <h2>Stock</h2>
      <div className="tab-bar">
        {TABS.map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Items' && (
        <>
          <StockItemForm onAdded={bump} />
          <StockTable items={stockItems} onChanged={bump} />
        </>
      )}

      {tab === 'Weekly / annual counts' && (
        <>
          <StockCountForm stockItems={stockItems} onAdded={bump} />
          <StockCountList counts={stockCounts} />
        </>
      )}

      {tab === 'Order receipts' && (
        <>
          <ReceiptForm stockItems={stockItems} onAdded={bump} />
          <ReceiptList receipts={receipts} />
        </>
      )}
    </div>
  )
}
