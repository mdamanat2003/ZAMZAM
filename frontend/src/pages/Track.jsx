import React, { useState, useEffect } from 'react'
import { API_BASE } from '../api'
import { useSearchParams } from 'react-router-dom'

export default function Track() {
  const [searchParams] = useSearchParams()
  const queryId = searchParams.get('id') || ''
  const [id, setId] = useState(queryId)
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchOrderById = async (orderId) => {
    if (!orderId) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: 'Bearer ' + token } : {}
      const res = await fetch(`${API_BASE}/api/orders/${orderId}`, { headers })
      const data = await res.json()
      if (res.ok) {
        setInfo(data)
      } else {
        alert(data.message || 'Order not found')
        setInfo(null)
      }
    } catch (err) {
      console.error(err)
      alert('Network error while fetching order details')
      setInfo(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (queryId) {
      setId(queryId)
      fetchOrderById(queryId)
    }
  }, [queryId])

  async function doTrack(e) {
    e.preventDefault()
    if (!id.trim()) return alert("Please enter Order ID")
    fetchOrderById(id.trim())
  }

  // Determine current active step (1 to 5) based on status
  const getStepIndex = (status = '') => {
    const s = status.toLowerCase()
    if (s.includes('deliver')) return 5
    if (s.includes('out')) return 4
    if (s.includes('ship')) return 3
    if (s.includes('confirm')) return 2
    return 1 // Placed / Pending / Paid
  }

  const steps = [
    { title: 'Order Placed', icon: '📦' },
    { title: 'Confirmed', icon: '✅' },
    { title: 'Shipped', icon: '🚚' },
    { title: 'Out for Delivery', icon: '🚴' },
    { title: 'Delivered', icon: '🎉' }
  ]

  const activeStep = info ? getStepIndex(info.status) : 0

  return (
    <div className="container" style={{ width: '100%', maxWidth: 750, marginTop: 20, marginBottom: 40 }}>
      <h2>Track Order Status</h2>

      {/* Search Input Form */}
      <form onSubmit={doTrack} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 25 }}>
        <input
          className="input"
          style={{ flex: '1 1 240px' }}
          value={id}
          onChange={e=>setId(e.target.value)}
          placeholder="Enter Order ID (e.g. 66a87c...)"
          required
        />
        <button className="btn" type="submit" style={{ padding: '10px 24px', fontSize: 15 }}>
          {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>

      {/* Track Result Details */}
      {info && (
        <div className="card" style={{ padding: 24, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, borderBottom: '1px solid #eee', paddingBottom: 12, marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: 13, color: '#888', display: 'block' }}>ORDER NUMBER</span>
              <h3 style={{ margin: 0, fontSize: 20, color: '#2c3e50' }}>#{info._id}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 13, color: '#888', display: 'block' }}>PLACED ON</span>
              <span style={{ fontSize: 14, fontWeight: 'bold' }}>
                {info.createdAt ? new Date(info.createdAt).toLocaleString() : 'Recent'}
              </span>
            </div>
          </div>

          {/* 5-Step Visual Tracking Bar */}
          <div style={{ marginBottom: 30, padding: '10px 0' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: 16, color: '#333' }}>Live Delivery Progress:</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', alignItems: 'flex-start' }}>
              {/* Background Connecting Line */}
              <div
                style={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  right: 20,
                  height: 4,
                  background: '#e0e0e0',
                  zIndex: 1
                }}
              />
              {/* Progress Active Line */}
              <div
                style={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  width: `${((activeStep - 1) / (steps.length - 1)) * 90}%`,
                  height: 4,
                  background: '#27ae60',
                  zIndex: 1,
                  transition: 'width 0.4s ease'
                }}
              />

              {steps.map((step, idx) => {
                const stepNum = idx + 1
                const isPassed = stepNum <= activeStep
                const isCurrent = stepNum === activeStep

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 2,
                      width: '18%',
                      textAlign: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: isPassed ? '#27ae60' : '#fff',
                        color: isPassed ? '#fff' : '#888',
                        border: isPassed ? '2px solid #27ae60' : '2px solid #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(39, 174, 96, 0.25)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {step.icon}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        marginTop: 8,
                        fontWeight: isCurrent ? 'bold' : 'normal',
                        color: isPassed ? '#27ae60' : '#777'
                      }}
                    >
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Ordered Products Section */}
          <div style={{ background: '#fafafa', border: '1px solid #eeeeee', borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: 15, color: '#333' }}>Ordered Items:</h4>
            {info.items && info.items.length > 0 ? (
              info.items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: idx < info.items.length - 1 ? '1px dashed #e0e0e0' : 'none', fontSize: 14 }}>
                  <span>{it.name} <strong>x {it.qty}</strong></span>
                  <span style={{ fontWeight: 'bold' }}>₹{it.price * it.qty}</span>
                </div>
              ))
            ) : (
              <p className="small">No item details available</p>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #e0e0e0', paddingTop: 10, marginTop: 10, fontWeight: 'bold', fontSize: 16 }}>
              <span>Total Amount:</span>
              <span style={{ color: '#8b6b1c' }}>₹{info.totalPrice || info.total || 0}</span>
            </div>
          </div>

          {/* Logged Updates */}
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: 15, color: '#333' }}>Status Logs & History:</h4>
            {info.tracking && info.tracking.length > 0 ? (
              info.tracking.map((t, idx) => (
                <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div className="small" style={{ color: '#888' }}>{new Date(t.at || t.date || t.createdAt || Date.now()).toLocaleString()}</div>
                  <div style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: 14 }}>
                    {t.status} {t.note ? `— ${t.note}` : ''}
                  </div>
                </div>
              ))
            ) : (
              <p className="small" style={{ color: '#777' }}>Order received and is currently being processed by our warehouse.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
