import { formatUGX } from '../utils/format.js'

export default function DebtBadge({ balance }) {
  if (balance <= 0) {
    return <span className="badge badge-clear">0 balance</span>
  }
  const tone = balance > 50000 ? 'badge-high' : 'badge-mid'
  return <span className={`badge ${tone}`}>{formatUGX(balance)}</span>
}
