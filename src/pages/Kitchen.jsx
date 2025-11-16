import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Kitchen() {
  const [table, setTable] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    setLoading(true)
    const url = new URL(`${API}/orders`)
    if (table) url.searchParams.set('table', table)
    const res = await fetch(url)
    const data = await res.json()
    setOrders(data)
    setLoading(false)
  }

  useEffect(() => { loadOrders() }, [table])

  const setStatus = async (id, status) => {
    await fetch(`${API}/orders/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    loadOrders()
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-4">
        <input value={table} onChange={e => setTable(e.target.value)} placeholder="Filter by table" className="border rounded px-3 py-2 w-48" />
        <button onClick={loadOrders} className="ml-auto px-3 py-2 border rounded">Refresh</button>
      </div>
      {loading ? 'Loading orders...' : (
        <div className="grid md:grid-cols-2 gap-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white rounded shadow p-4">
              <div className="font-semibold">Table: {o.table_number}</div>
              <div className="text-sm text-gray-600">Status: {o.status}</div>
              <ul className="mt-2 text-sm list-disc pl-5">
                {o.items.map((it, idx) => (
                  <li key={idx}>{it.name} x {it.quantity} — ₹{it.total.toFixed(2)}</li>
                ))}
              </ul>
              <div className="mt-3 flex gap-2 flex-wrap">
                {['placed','preparing','ready','served'].map(s => (
                  <button key={s} onClick={() => setStatus(o.id, s)} className={`px-3 py-1 rounded border ${o.status===s?'bg-blue-600 text-white':''}`}>{s}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
