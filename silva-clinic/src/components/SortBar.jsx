const options = [
  { value: 'debt-desc', label: 'Debt: high to low' },
  { value: 'debt-asc', label: 'Debt: low to high' },
  { value: 'date-desc', label: 'Last visit: new to old' },
  { value: 'date-asc', label: 'Last visit: old to new' },
  { value: 'stale', label: 'Delayed / no recent activity' },
]

export default function SortBar({ value, onChange, search, onSearchChange }) {
  return (
    <div className="sort-bar">
      <input
        className="input"
        placeholder="Search patient name..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
