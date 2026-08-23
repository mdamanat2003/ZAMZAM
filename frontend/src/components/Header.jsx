import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header({ onSearch }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const admin = JSON.parse(localStorage.getItem('user_admin') || 'null')

  function doSearch(e) {
    e.preventDefault()
    if (onSearch) onSearch(q)
    navigate('/home?q=' + encodeURIComponent(q))
  }

  function handleLogout() {
    localStorage.removeItem('user')
    localStorage.removeItem('user_admin')
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="menu-btn" onClick={() => setOpen(!open)}>☰</div>
        <Link to="/home" className="logo-text">Zam-zam General Store</Link>

        {open && (
          <div className="menu-dropdown">
            <div className="menbtn" style={{ marginBottom: 8 }}>
              <Link style={{ textDecoration: "none" }} to="/account">Your Account</Link>
            </div>
            <div className="menbtn" style={{ marginBottom: 8 }}>
              <Link style={{ textDecoration: "none" }} to="/cart">Cart</Link>
            </div>
            <div className="menbtn" style={{ marginBottom: 8 }}>
              <Link style={{ textDecoration: "none" }} to="/">Home</Link>
            </div>
            <div className="menbtn" style={{ marginBottom: 8 }}>
              <Link style={{ textDecoration: "none" }} to="/orders">Your Orders</Link>
            </div>
            <div className="menbtn" style={{ marginBottom: 8 }}>
              <Link style={{ textDecoration: "none" }} to="/track">Track Order</Link>
            </div>
            <div className="menbtn" style={{ marginBottom: 8 }}>
              <Link style={{ textDecoration: "none" }} to="/wishlist">Wishlist</Link>
            </div>
            <div className="menbtn" style={{ marginBottom: 8 }}>
            <Link  style={{ textDecoration: "none" }} to="/about" className="nav-link">About</Link>
            </div>
            <div className="menbtn" style={{ marginBottom: 8 }}>
            <Link style={{ textDecoration: "none" }} to="/help" className="nav-link">Help</Link>
            </div>



            {/* ✅ Logout button (only if logged in) */}
            {user && (
              <div className="menbtn" style={{ marginTop: 8, color: "red", cursor: "pointer" }} onClick={handleLogout}>
                Logout
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={doSearch}>
        <input
          className="search"
          placeholder="Search here..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </form>

      <div className="nav-links">
        {admin ? (
          <>
            <div className="badge">{admin.name} (Admin)</div>
            <Link to="/admin" className="badge">Admin Panel</Link>
            <div className="badge" style={{cursor:'pointer'}} onClick={handleLogout}>Logout</div>
          </>
        ) : (
          <>
            <div className="badge">{user ? user.name : <Link to="/login">Login</Link>}</div>
            <Link to="/cart" className="badge" style={{ textDecoration: "none" }}>Cart</Link>
            <Link to="/about" className="badge" style={{ textDecoration: "none" }}>About Us</Link>
            <Link to="/help" className="badge" style={{ textDecoration: "none" }}>Help</Link>
          </>
        )}
        
      </div>
    </div>
  )
}
