import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { to: '/customer', label: 'Customer' },
  { to: '/kitchen', label: 'Kitchen' },
  { to: '/billing', label: 'Billing' },
  { to: '/admin', label: 'Admin' },
]

export default function Navbar() {
  const location = useLocation()
  return (
    <div className="w-full bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">Hotel Orders</Link>
        <nav className="flex gap-2">
          {tabs.map(t => {
            const active = location.pathname.startsWith(t.to)
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`px-3 py-2 rounded-md text-sm font-medium ${active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}
              >
                {t.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
