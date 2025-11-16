import { Link } from 'react-router-dom'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Hotel Online Ordering</h1>
        <p className="text-gray-700 mb-6">A simple system with Customer, Kitchen, Billing and Admin panels.</p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Panel to="/customer" title="Customer" desc="Browse menu and place order by table number." />
          <Panel to="/kitchen" title="Kitchen" desc="See incoming orders by table and update status." />
          <Panel to="/billing" title="Billing" desc="View unpaid orders and collect payments." />
          <Panel to="/admin" title="Admin" desc="Manage menu items, pricing and availability." />
        </div>

        <div className="mt-8">
          <Link className="text-blue-600 underline" to="/test">Check backend & database status</Link>
        </div>
      </div>
    </div>
  )
}

function Panel({ to, title, desc }) {
  return (
    <Link to={to} className="bg-white rounded shadow p-5 hover:shadow-md transition">
      <div className="text-xl font-semibold">{title}</div>
      <div className="text-sm text-gray-600">{desc}</div>
    </Link>
  )
}
