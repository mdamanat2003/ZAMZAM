import React, { useEffect, useState } from 'react'
import { API_BASE } from '../api'
import { Link, useNavigate } from 'react-router-dom'

export default function Orders(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(()=> {
    const token = localStorage.getItem('token')
    if(!token) {
      setLoading(false)
      return
    }
    fetch(API_BASE + '/api/orders', { headers:{ Authorization:'Bearer '+token } })
      .then(r=>r.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data)
        else setOrders([])
      })
      .catch(()=>setOrders([]))
      .finally(()=>setLoading(false))
  }, [])

  const getStatusStyle = (status = '') => {
    const s = status.toLowerCase()
    if (s.includes('deliver')) return { bg: '#e8f8f5', color: '#27ae60', border: '#27ae60', text: 'Delivered 🎉' }
    if (s.includes('ship')) return { bg: '#ebf5fb', color: '#2980b9', border: '#2980b9', text: 'Shipped 🚚' }
    if (s.includes('out')) return { bg: '#fef5e7', color: '#e67e22', border: '#e67e22', text: 'Out for Delivery 🚴' }
    if (s.includes('confirm')) return { bg: '#f4ecf7', color: '#8e44ad', border: '#8e44ad', text: 'Confirmed ✅' }
    if (s.includes('paid')) return { bg: '#e8f8f5', color: '#27ae60', border: '#27ae60', text: 'Paid ✅' }
    return { bg: '#fef9e7', color: '#d35400', border: '#f39c12', text: 'Pending ⏳' }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <h2>Your Orders</h2>
        <p>Loading your orders...</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ marginTop: 20, marginBottom: 40 }}>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            maxWidth: 540,
            margin: '30px auto',
            borderRadius: 16,
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            background: '#ffffff',
            border: '1px solid #eaeaea'
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>📦</div>
          <h3 style={{ fontSize: 24, margin: '0 0 12px', color: '#2c3e50', fontWeight: 'bold' }}>
            No Orders Placed Yet
          </h3>
          <p style={{ color: '#666', fontSize: 15, lineHeight: 1.6, maxWidth: 420, margin: '0 auto 28px' }}>
            When you place an order, you can track its live delivery status and view order details right here!
          </p>
          <Link to="/home" style={{ textDecoration: 'none' }}>
            <button
              className="btn"
              style={{
                padding: '14px 34px',
                fontSize: 16,
                fontWeight: 'bold',
                borderRadius: 30,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
              }}
            >
              🛍️ Go Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {orders.map(o => {
            const statusInfo = getStatusStyle(o.status)
            return (
              <div
                key={o._id}
                className="card"
                style={{
                  padding: 20,
                  borderRadius: 12,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  border: '1px solid #eee',
                  background: '#fff'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, borderBottom: '1px solid #f0f0f0', paddingBottom: 12, marginBottom: 14 }}>
                  <div>
                    <span style={{ fontSize: 13, color: '#888', display: 'block' }}>ORDER ID</span>
                    <strong style={{ fontSize: 16, color: '#2c3e50' }}>#{o._id}</strong>
                    <span style={{ fontSize: 12, color: '#777', marginLeft: 10 }}>
                      Placed on {new Date(o.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span
                      style={{
                        background: statusInfo.bg,
                        color: statusInfo.color,
                        border: `1px solid ${statusInfo.border}`,
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontWeight: 'bold',
                        fontSize: 13
                      }}
                    >
                      {statusInfo.text}
                    </span>

                    {/* Track Your Order Side Button */}
                    <button
                      className="btn"
                      onClick={() => navigate('/track?id=' + o._id)}
                      style={{
                        padding: '8px 16px',
                        fontSize: 14,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: '#2c3e50'
                      }}
                    >
                      📍 Track Your Order
                    </button>
                  </div>
                </div>

                {/* Items & Payment Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ flex: '1 1 260px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: 15, color: '#444' }}>Items Ordered:</h4>
                    {o.items && o.items.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {o.items.map((it, idx) => (
                          <div key={idx} style={{ fontSize: 14, color: '#555' }}>
                            • <strong>{it.name || 'Product'}</strong> — Qty: {it.qty} × ₹{it.price}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 14, color: '#777' }}>Product items details</div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', minWidth: 160 }}>
                    <div style={{ fontSize: 13, color: '#888' }}>Payment Method: <strong>{o.paymentMethod || 'COD'}</strong></div>
                    <div style={{ fontSize: 20, fontWeight: 'bold', color: '#8b6b1c', marginTop: 4 }}>
                      Total: ₹{o.totalPrice}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
