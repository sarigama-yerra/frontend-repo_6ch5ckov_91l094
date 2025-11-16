import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Admin() {
  const [menu, setMenu] = useState([])
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '' })

  const load = async () => {
    const res = await fetch(`${API}/menu`)
    const data = await res.json()
    setMenu(data)
  }

  useEffect(() => { load() }, [])

  const createItem = async (e) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      price: parseFloat(form.price || '0'),
      description: form.description || undefined,
      category: form.category || undefined,
      is_available: true
    }
    await fetch(`${API}/menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setForm({ name: '', price: '', description: '', category: '' })
    load()
  }

  const toggleAvailability = async (id, current) => {
    await fetch(`${API}/menu/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_available: !current }) })
    load()
  }

  const updatePrice = async (id, price) => {
    await fetch(`${API}/menu/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ price: parseFloat(price) }) })
    load()
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Menu Management</h2>
      <form onSubmit={createItem} className="grid md:grid-cols-5 gap-2 mb-6">
        <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="border rounded px-3 py-2" />
        <input required type="number" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price" className="border rounded px-3 py-2" />
        <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Category" className="border rounded px-3 py-2" />
        <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" className="border rounded px-3 py-2" />
        <button className="bg-blue-600 text-white rounded px-4 py-2">Add Item</button>
      </form>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {menu.map(m => (
          <div key={m.id} className="bg-white rounded shadow p-4">
            <div className="font-semibold text-lg">{m.name}</div>
            <div className="text-sm text-gray-600">{m.category || 'Uncategorized'}</div>
            <div className="mt-2">
              <label className="text-sm mr-2">Price (₹)</label>
              <input type="number" step="0.01" defaultValue={m.price} onBlur={e => updatePrice(m.id, e.target.value)} className="border rounded px-2 py-1 w-28" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-sm ${m.is_available ? 'text-green-600' : 'text-red-600'}`}>{m.is_available ? 'Available' : 'Unavailable'}</span>
              <button onClick={() => toggleAvailability(m.id, m.is_available)} className="px-3 py-1 border rounded">
                {m.is_available ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
