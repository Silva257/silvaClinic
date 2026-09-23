import { FaTrash } from 'react-icons/fa'
import { stockApi } from '../utils/storage.js'

export default function StockTable({ items, onChanged }) {
  function remove(id) {
    if (!confirm('Remove this item from stock list?')) return
    stockApi.remove(id)
    onChanged?.()
  }

  if (!items.length) return <p className="muted">No stock items yet - add your initial stock above.</p>

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Unit</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((it) => (
          <tr key={it.id} className={it.quantity <= it.reorderLevel ? 'row-warning' : ''}>
            <td>{it.name}</td>
            <td>{it.quantity}</td>
            <td>{it.unit}</td>
            <td>{it.quantity <= it.reorderLevel ? 'Low - reorder' : 'OK'}</td>
            <td>
              <button className="icon-btn" onClick={() => remove(it.id)}>
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
