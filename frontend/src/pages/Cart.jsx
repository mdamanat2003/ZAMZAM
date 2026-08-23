
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
      if (!token) {
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
        setCart([])
      }
      setLoading(false)
    }
    fetchCart()
  }, [])


  async function removeItem(idx) {
    const token = localStorage.getItem('token');
    const productId = cart[idx].product;
    try {
      await axios.delete(`${API_BASE}/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      // Remove from local state
      setCart(cart.filter((_, i) => i !== idx));
    } catch (err) {
      alert('Failed to remove item');
    }
  }

  async function changeQty(idx, delta){
    const token = localStorage.getItem('token')
    const productId = cart[idx].product
    try {
      if(delta > 0){
        await axios.post(`${API_BASE}/api/cart`, { productId }, { headers:{ Authorization:`Bearer ${token}` }, withCredentials:true })
        const newCart = [...cart]
        newCart[idx].qty = newCart[idx].qty + 1
        setCart(newCart)
      } else {
        // decrement via backend
        await axios.post(`${API_BASE}/api/cart/decrement/${productId}`, {}, { headers:{ Authorization:`Bearer ${token}` }, withCredentials:true })
        const newCart = [...cart]
        newCart[idx].qty = Math.max(1, newCart[idx].qty - 1)
        // if qty becomes 0 remove item
        if(newCart[idx].qty === 0){ newCart.splice(idx,1) }
        setCart(newCart)
      }
    } catch(err){
      console.error(err)
      alert('Failed to update quantity')
    }
  }

  const total = cart.reduce((s, it) => s + it.price * it.qty, 0)

  function proceed() {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    navigate('/checkout')
  }

  if (loading) return <div className="container"><h2>Your Cart</h2><p>Loading...</p></div>

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {cart.length === 0 ? <p>Cart is empty. <Link to="/home">Go shopping</Link></p> : (
        <>
          {cart.map((it, idx) => (
            <div key={it.product} className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <img src={it.image} style={{ width: 90, height: 75, objectFit: 'cover', borderRadius: 6 }} />
              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                <h4 style={{ margin: '0 0 4px' }}>{it.name}</h4>
                <p className="small" style={{ margin: 0 }}>₹{it.price} x {it.qty}</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 'fit-content' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn" style={{ padding: '6px 12px' }} onClick={() => changeQty(idx, -1)}>-</button>
                  <button className="btn" style={{ padding: '6px 12px' }} onClick={() => changeQty(idx, 1)}>+</button>
                </div>
                <button style={{ background: '#c00', padding: '6px 12px' }} className="btn" onClick={() => removeItem(idx)}>Remove</button>
              </div>
             
            </div>
          ))}
          <h3>Total: ₹{total}</h3>
          <button className="btn" onClick={proceed}>Proceed to Checkout</button>
        </>
      )}
    </div>
  )
}