import "./admin.css";

import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { API_BASE } from '../api'

export default function Admin() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || !user || !user.isAdmin) return

    // Products fetch
    fetch(API_BASE + '/api/admin/products', {
      headers: { Authorization: 'Bearer ' + token }
    }).then(r => r.json()).then(setProducts).catch(console.error)

    // Orders fetch
    fetch(API_BASE + '/api/admin/orders', {
      headers: { Authorization: 'Bearer ' + token }
    }).then(r => r.json()).then(setOrders).catch(console.error)
  }, [])

  async function updateStatus(id, status) {
    const token = localStorage.getItem('token')
    if (!token) return alert('Not authorized')

    const res = await fetch(API_BASE + '/api/admin/order/' + id + '/status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ status })
    })
    if (!res.ok) return alert('Update failed')
    const updated = await res.json()
    setOrders(prev => prev.map(o => o._id === updated._id ? updated : o))
    alert('Status updated')
  }

  return (
    <>
      
      <div className="container">
        <h2>Admin Panel</h2>
        <section>
          <h3>Orders</h3>
          {orders.length === 0 ? <p>No orders</p> : orders.map(o=>(
            <div key={o._id} className="card" style={{ marginBottom: 16 }}>
              <div><strong>Order:</strong> {o._id}</div>
              <div><strong>User:</strong> {o.user?.name} ({o.user?.email})</div>
              <div><strong>Items:</strong> {o.items.map(i=>i.name + ' x' + i.qty).join(', ')}</div>
              

<div className="status-container">
  <label className="status-label">Change status:</label>
  <select
    className={`status-select ${o.status || "pending"}`}
    value={o.status || "pending"}
    onChange={(e) => updateStatus(o._id, e.target.value)}
  >
    <option value="pending">Pending</option>
    <option value="confirmed">Confirmed</option>
    <option value="shipped">Shipped</option>
    <option value="out-for-delivery">Out For Delivery</option>
    <option value="delivered">Delivered</option>
  </select>
</div>

              <div>
                <h4>Tracking</h4>
                {o.tracking && o.tracking.length>0 ? o.tracking.map((t,idx)=>(
                  <div key={idx}>
                    <div className="small">{new Date(t.at || t.date || t.createdAt).toLocaleString()}</div>
                    <div>{t.status} {t.note ? `- ${t.note}` : ''}</div>
                  </div>
                )) : <p>No tracking yet</p>}
              </div>
            </div>
          ))}
        </section>
        <section>
          <h3>Products</h3>
          {products.length === 0 ? <p>No products</p> : products.map(p=>(
            <div key={p._id} className="card">
              <div>{p.name}</div>
              <div>Price: ₹{p.price}</div>
              <div>Stock: {p.countInStock}</div>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}
