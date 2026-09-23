import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import PatientsList from './pages/PatientsList.jsx'
import PatientDetail from './pages/PatientDetail.jsx'
import Stock from './pages/Stock.jsx'
import Dosing from './pages/Dosing.jsx'
import Lending from './pages/Lending.jsx'
import Finance from './pages/Finance.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/patients" element={<PatientsList />} />
        <Route path="/patients/:id" element={<PatientDetail />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/dosing" element={<Dosing />} />
        <Route path="/lending" element={<Lending />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
