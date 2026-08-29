import React, { useEffect, useState } from 'react'
import { API_BASE } from '../api'
import { Link, useNavigate } from 'react-router-dom'

export default function Wishlist(){
  const [items, setItems] = useState([])
  const navigate = useNavigate()

  useEffect(()=> {
    const token = localStorage.getItem('token')
    if(!token || token === 'null' || token === 'undefined') return
    fetch(API_BASE + '/api/wishlist', { headers:{ Authorization:'Bearer '+token } })
      .then(r=> {
        if (r.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          return []
        }
        return r.json()
      })
      .then(setItems)
      .catch(()=>setItems([]))
  }, [])

  async function remove(id){
    const token = localStorage.getItem('token')
    if (!token) return navigate('/login');
    await fetch(API_BASE + '/api/wishlist/'+id, { method:'DELETE', headers:{ Authorization:'Bearer '+token } })
    setItems(items.filter(i=>i._id !== id))
  }

  return (
    <div className="container" style={{ marginTop: 20, marginBottom: 40 }}>
      <h2>Your Wishlist</h2>
      {items.length === 0 ? (
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
          <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>❤️</div>
          <h3 style={{ fontSize: 24, margin: '0 0 12px', color: '#2c3e50', fontWeight: 'bold' }}>
            Your Wishlist is Currently Empty
          </h3>
          <p style={{ color: '#666', fontSize: 15, lineHeight: 1.6, maxWidth: 420, margin: '0 auto 28px' }}>
            Save your favorite luxury perfumes, attars, and aromatherapy gifts to your personal wishlist for easy shopping later!
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
        <div className="grid">
          {items.map(p=>(
            <div className="card" key={p._id}>
              <Link to={'/product/'+p._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={p.image} alt={p.name} style={{ cursor: 'pointer' }} />
                <h3>{p.name}</h3>
              </Link>
              <p className="small">₹{p.price}</p>
              <div style={{display:'flex',gap:8}}>
                <button className="btn" onClick={()=>navigate('/product/'+p._id)}>Buy Now</button>
                <button className="btn" style={{background:'#a00'}} onClick={()=>remove(p._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
