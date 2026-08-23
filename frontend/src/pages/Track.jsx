import React, { useState } from 'react'
import { API_BASE } from '../api'
import axios from 'axios'

export default function Track() {
  const [id, setId] = useState('')
  const [info, setInfo] = useState(null)

  const fetchOrder = async () => {
  try {
    const token = localStorage.getItem("token"); // or from context/state
    const { data } = await axios.get(
      `${API_BASE}/api/orders/68dcfa82b3b2f60e20ad1ff3`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};

  async function doTrack(e) {
    e.preventDefault()
    if (!id) return alert("Please enter Order ID")

    try {
      const res = await fetch(`${API_BASE}/api/orders/${id}`)
      const data = await res.json()
      if (res.ok) {
        setInfo(data)
      } else {
        alert(data.message || 'Order not found')
      }
    } catch (err) {
      console.error(err)
      alert('Network error')
    }
  }

  return (
    <>
     
      <div className="container" style={{ width: '100%', maxWidth: 600 }}>
        <h2>Track Order</h2>
        <form onSubmit={doTrack} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <input className="input" style={{ flex: '1 1 200px' }} value={id} onChange={e=>setId(e.target.value)} placeholder="Enter Order ID" />
          <button className="btn" type="submit" style={{ padding: '10px 20px' }}>
            Track
          </button>
        </form>

        {info && (
          <div className="card">
            <h3>Order {info._id}</h3>
            <div><strong>Status:</strong> {info.status}</div>
            <div><strong>Items:</strong> {info.items.map(i=>i.name + ' x' + i.qty).join(', ')}</div>
            <div>
              <h4>Tracking updates</h4>
              {info.tracking && info.tracking.length>0 ? info.tracking.map((t,idx)=>(
                <div key={idx}>
                  <div className="small">{new Date(t.at || t.date || t.createdAt).toLocaleString()}</div>
                  <div>{t.status} {t.note ? `- ${t.note}` : ''}</div>
                  <hr />
                </div>
              )) : <p className="small">No updates yet</p>}
            </div>
          </div>
        )}
       
      </div>
    </>
  )
}
