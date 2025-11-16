import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Billing() {
  const [data, setData] = useState({ orders: [], total_to_collect: 0 })

  const load = async () => {
    const res = await fetch(`${API}/billing`)
    const d = await res.json()
    setData(d)
  }

  useEffect(() => { load() }, [])

  const markPaid = async (id) => {
    await fetch(`${API}/orders/${id}/pay`, { method: 'PATCH' })
    load()
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold">Pending Bills</h2>
        <button onClick={load} className="ml-auto px-3 py-2 border rounded">Refresh</button>
      </div>
      <div className="mb-4 text-lg">Total to collect: ₹{data.total_to_collect?.toFixed(2)}</div>
      <div className="space-y-3">
        {data.orders.map(o => (
          <div key={o.id} className="bg-white rounded shadow p-4">
            <div className="flex items-center">
              <div className="font-semibold">Table {o.table_number}</div>
              <div className="ml-3 text-sm text-gray-600">Status: {o.status}</div>
              <div className="ml-auto font-semibold">₹{o.total.toFixed(2)}</div>
            </div>
            <ul className="mt-2 text-sm list-disc pl-5">
              {o.items.map((it, idx) => (
                <li key={idx}>{it.name} x {it.quantity} — ₹{it.total.toFixed(2)}</li>
              ))}
            </ul>
            <div className="mt-3 text-right">
              <button onClick={() => markPaid(o.id)} className="px-4 py-2 bg-green-600 text-white rounded">Mark Paid</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
