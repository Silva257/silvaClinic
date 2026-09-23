import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  FaHome,
  FaUserInjured,
  FaBoxes,
  FaSyringe,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaBars,
  FaTimes,
} from 'react-icons/fa'

const links = [
  { to: '/', label: 'Home', icon: <FaHome />, end: true },
  { to: '/patients', label: 'Patients', icon: <FaUserInjured /> },
  { to: '/stock', label: 'Stock', icon: <FaBoxes /> },
  { to: '/dosing', label: 'Dosing', icon: <FaSyringe /> },
  { to: '/lending', label: 'Lending', icon: <FaExchangeAlt /> },
  { to: '/finance', label: 'Finance', icon: <FaMoneyBillWave /> },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          Silva Clinic
        </NavLink>
        <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
              onClick={() => setOpen(false)}
            >
              {l.icon}
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
