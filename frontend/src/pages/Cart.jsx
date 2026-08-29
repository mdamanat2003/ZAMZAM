
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE } from '../api'
import { Link, useNavigate } from 'react-router-dom'

export default function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchCart() {
      const token = localStorage.getItem('token')
      if (!token || token === 'null' || token === 'undefined') {
        setCart([])
        setLoading(false)
        return
      }
      try {
        const res = await axios.get(`${API_BASE}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        })
        setCart(res.data)
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
        setCart([])
      }
      setLoading(false)
    }
    fetchCart()
  }, [])

  async function removeItem(idx) {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    const productId = cart[idx].product;
    try {
      await axios.delete(`${API_BASE}/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setCart(cart.filter((_, i) => i !== idx));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      } else {
        alert('Failed to remove item');
      }
    }
  }

  async function changeQty(idx, delta){
    const token = localStorage.getItem('token')
    if (!token) return navigate('/login');
    const productId = cart[idx].product
    try {
      if(delta > 0){
        await axios.post(`${API_BASE}/api/cart`, { productId }, { headers:{ Authorization:`Bearer ${token}` }, withCredentials:true })
        const newCart = [...cart]
        newCart[idx].qty = newCart[idx].qty + 1
        setCart(newCart)
      } else {
        await axios.post(`${API_BASE}/api/cart/decrement/${productId}`, {}, { headers:{ Authorization:`Bearer ${token}` }, withCredentials:true })
        const newCart = [...cart]
        newCart[idx].qty = Math.max(1, newCart[idx].qty - 1)
        if(newCart[idx].qty === 0){ newCart.splice(idx,1) }
        setCart(newCart)
      }
    } catch(err){
      console.error(err)
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      } else {
        alert('Failed to update quantity')
      }
    }
  }

  const total = cart.reduce((s, it) => s + it.price * it.qty, 0)

  function proceed() {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    navigate('/checkout')
  }

  if (loading) return <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}><h2>Your Cart</h2><p>Loading items...</p></div>

  return (
    <div className="container" style={{ marginTop: 20, marginBottom: 40 }}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
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
          <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>🛒</div>
          <h3 style={{ fontSize: 24, margin: '0 0 12px', color: '#2c3e50', fontWeight: 'bold' }}>
            Your Shopping Cart is Empty
          </h3>
          <p style={{ color: '#666', fontSize: 15, lineHeight: 1.6, maxWidth: 420, margin: '0 auto 28px' }}>
            Looks like you haven't added any luxury perfumes or fragrances to your cart yet. Explore our handcrafted collection today!
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
        <>
          {cart.map((it, idx) => (
            <div key={it.product} className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 14, padding: 16 }}>
              <img src={it.image} alt={it.name} style={{ width: 90, height: 80, objectFit: 'cover', borderRadius: 8 }} />
              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                <h4 style={{ margin: '0 0 6px', fontSize: 18 }}>{it.name}</h4>
                <p className="small" style={{ margin: 0, fontSize: 15, fontWeight: 'bold', color: '#2c3e50' }}>
                  ₹{it.price} x {it.qty} = <span style={{ color: '#8b6b1c' }}>₹{it.price * it.qty}</span>
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 'fit-content' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn" style={{ padding: '6px 14px', background: '#555' }} onClick={() => changeQty(idx, -1)}>-</button>
                  <button className="btn" style={{ padding: '6px 14px', background: '#555' }} onClick={() => changeQty(idx, 1)}>+</button>
                </div>
                <button style={{ background: '#c00', padding: '6px 12px' }} className="btn" onClick={() => removeItem(idx)}>Remove</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '2px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <h3 style={{ margin: 0, fontSize: 24 }}>Total Amount: <span style={{ color: '#8b6b1c' }}>₹{total}</span></h3>
            <button className="btn" onClick={proceed} style={{ padding: '14px 28px', fontSize: 16 }}>
              Proceed to Checkout →
            </button>
          </div>
        </>
      )}
    </div>
  )
}