import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Customer() {
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [table, setTable] = useState('')
  const [cart, setCart] = useState({})
  const [placing, setPlacing] = useState(false)
  const [message, setMessage] = useState('')

  const loadMenu = async () => {
    setLoading(true)
    const res = await fetch(`${API}/menu`)
    const data = await res.json()
    setMenu(data.filter(i => i.is_available !== false))
    setLoading(false)
  }

  useEffect(() => { loadMenu() }, [])

  const addToCart = (item) => {
    setCart(prev => ({ ...prev, [item.id]: { item, qty: (prev[item.id]?.qty || 0) + 1 } }))
  }
  const removeFromCart = (id) => {
    setCart(prev => {
      const copy = { ...prev }
      if (!copy[id]) return prev
      copy[id].qty -= 1
      if (copy[id].qty <= 0) delete copy[id]
      return copy
    })
  }

  const itemsArray = Object.values(cart)
  const subTotal = itemsArray.reduce((s, it) => s + it.item.price * it.qty, 0)

  const placeOrder = async () => {
    if (!table) { setMessage('Enter table number'); return }
    if (itemsArray.length === 0) { setMessage('Add items to cart'); return }
    setPlacing(true)
    try {
      const payload = {
        table_number: table,
        items: itemsArray.map(({ item, qty }) => ({ menu_item_id: item.id, quantity: qty }))
      }
      const res = await fetch(`${API}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Failed to place order')
      await res.json()
      setCart({})
      setMessage('Order placed!')
    } catch (e) {
      setMessage(e.message)
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center gap-3 mb-4">
          <input value={table} onChange={e => setTable(e.target.value)} placeholder="Table number" className="border rounded px-3 py-2 w-40" />
          <div className="ml-auto text-sm text-gray-600">Cart items: {itemsArray.length} | Subtotal: ₹{subTotal.toFixed(2)}</div>
          <button onClick={placeOrder} disabled={placing} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">Place Order</button>
        </div>
        {message && <div className="mb-4 text-sm text-green-700">{message}</div>}
        {loading ? (
          <div>Loading menu...</div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {menu.map(item => (
              <div key={item.id} className="bg-white rounded shadow p-4 flex flex-col">
                <div className="font-semibold text-lg">{item.name}</div>
                <div className="text-sm text-gray-600 flex-1">{item.description}</div>
                <div className="mt-2 font-semibold">₹{item.price}</div>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => removeFromCart(item.id)} className="px-3 py-1 border rounded">-</button>
                  <span>{cart[item.id]?.qty || 0}</span>
                  <button onClick={() => addToCart(item)} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
