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
    setOpen(false)
  }

  function handleLogout() {
    localStorage.removeItem('user')
    localStorage.removeItem('user_admin')
    localStorage.removeItem('token')
    setOpen(false)
    navigate('/login')
  }

  return (
    <div className="header">
      <div className="header-brand">
        <div className="menu-btn" onClick={() => setOpen(!open)}>☰</div>
        <Link to="/home" className="logo-text">Zam-zam General Store</Link>

        {open && (
          <div className="menu-dropdown">
            <form onSubmit={doSearch} style={{ marginBottom: 12 }}>
              <input
                className="search mobile-search"
                placeholder="Search products..."
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </form>

            <div className="menbtn" style={{ marginBottom: 8 }}>
              <Link style={{ textDecoration: "none", color: "inherit", display: "block" }} to="/" onClick={() => setOpen(false)}>Home</Link>
            </div>
            <div className="menbtn" style={{ marginBottom: 8 }}>
              <Link style={{ textDecoration: "none", color: "inherit", display: "block" }} to="/account" onClick={() => setOpen(false)}>
                {user ? `Account (${user.name})` : "Login / Account"}
              </Link>
            </div>
            <div className="menbtn" style={{ marginBottom: 8 }}>
              <Link style={{ textDecoration: "none", color: "inherit", display: "block" }} to="/cart" onClick={() => setOpen(false)}>Cart</Link>
            </div>
            <div className="menbtn" style={{ marginBottom: 8 }}>
              <Link style={{ textDecoration: "none", color: "inherit", display: "block" }} to="/orders" onClick={() => setOpen(false)}>Your Orders</Link>
            </div>
            <div className="menbtn" style={{ marginBottom: 8 }}>
              <Link style={{ textDecoration: "none", color: "inherit", display: "block" }} to="/track" onClick={() => setOpen(false)}>Track Order</Link>
            </div>
            <div className="menbtn" style={{ marginBottom: 8 }}>
              <Link style={{ textDecoration: "none", color: "inherit", display: "block" }} to="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>
            </div>
            <div className="menbtn" style={{ marginBottom: 8 }}>
              <Link style={{ textDecoration: "none", color: "inherit", display: "block" }} to="/about" onClick={() => setOpen(false)}>About Us</Link>
            </div>
            <div className="menbtn" style={{ marginBottom: 8 }}>
              <Link style={{ textDecoration: "none", color: "inherit", display: "block" }} to="/help" onClick={() => setOpen(false)}>Help</Link>
            </div>

            {admin && (
              <div className="menbtn" style={{ marginBottom: 8, background: "#7a5913" }}>
                <Link style={{ textDecoration: "none", color: "inherit", display: "block" }} to="/admin" onClick={() => setOpen(false)}>Admin Panel</Link>
              </div>
            )}

            {user && (
              <div className="menbtn" style={{ marginTop: 8, background: "#c00", cursor: "pointer" }} onClick={handleLogout}>
                Logout
              </div>
            )}
          </div>
        )}
      </div>

      <form className="desktop-search-form" onSubmit={doSearch}>
        <input
          className="search"
          placeholder="Search products here..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </form>

      <div className="nav-links desktop-nav-links">
        {admin ? (
          <>
            <div className="badge">{admin.name} (Admin)</div>
            <Link to="/admin" className="badge" style={{ textDecoration: "none" }}>Admin Panel</Link>
            <div className="badge" style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</div>
          </>
        ) : (
          <>
            <div className="badge">{user ? user.name : <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>}</div>
            <Link to="/cart" className="badge" style={{ textDecoration: "none" }}>Cart</Link>
            <Link to="/about" className="badge" style={{ textDecoration: "none" }}>About Us</Link>
            <Link to="/help" className="badge" style={{ textDecoration: "none" }}>Help</Link>
          </>
        )}
      </div>
    </div>
  )
}
