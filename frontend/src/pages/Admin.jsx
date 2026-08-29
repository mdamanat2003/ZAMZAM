import "./admin.css";
import React, { useEffect, useState } from 'react';
import { API_BASE } from '../api';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user || !user.isAdmin) return;

    setLoading(true);
    Promise.all([
      fetch(API_BASE + '/api/admin/products', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()),
      fetch(API_BASE + '/api/admin/orders', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json())
    ])
      .then(([prodsData, ordersData]) => {
        if (Array.isArray(prodsData)) setProducts(prodsData);
        if (Array.isArray(ordersData)) setOrders(ordersData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id, status) {
    const token = localStorage.getItem('token');
    if (!token) return alert('Not authorized');

    try {
      const res = await fetch(API_BASE + '/api/admin/order/' + id + '/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ status })
      });
      if (!res.ok) return alert('Update failed');
      const updated = await res.json();
      setOrders(prev => prev.map(o => o._id === updated._id ? updated : o));
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  }

  // Calculate Summary Statistics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingCount = orders.filter(o => !o.status || o.status.toLowerCase() === 'pending').length;

  // Filter Orders
  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'all') return true;
    return (o.status || 'pending').toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h2 className="admin-title">Admin Dashboard</h2>
          <div style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            Manage store orders, track shipments, and oversee product inventory.
          </div>
        </div>
        {user && (
          <div style={{ background: '#f1f5f9', padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 'bold', color: '#334155' }}>
            👤 {user.name} (Admin)
          </div>
        )}
      </div>

      {/* Top Quick Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}>💰</div>
          <div className="stat-info">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">₹{totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon" style={{ background: '#f0fdf4', color: '#15803d' }}>📦</div>
          <div className="stat-info">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{orders.length}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}>⏳</div>
          <div className="stat-info">
            <span className="stat-label">Pending Orders</span>
            <span className="stat-value">{pendingCount}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon" style={{ background: '#fae8ff', color: '#86198f' }}>🛍️</div>
          <div className="stat-info">
            <span className="stat-label">Catalog Products</span>
            <span className="stat-value">{products.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Orders Management ({orders.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          🛍️ Products Inventory ({products.length})
        </button>
      </div>

      {/* Orders Section */}
      {activeTab === 'orders' && (
        <div>
          {/* Status Filter Buttons */}
          <div className="filter-bar">
            <span style={{ fontSize: 14, fontWeight: 'bold', color: '#64748b', marginRight: 8 }}>Filter Status:</span>
            {['all', 'pending', 'confirmed', 'shipped', 'out-for-delivery', 'delivered'].map((st) => (
              <button
                key={st}
                className={`filter-btn ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st.toUpperCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <p style={{ color: '#64748b' }}>Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              No orders found for this status.
            </div>
          ) : (
            filteredOrders.map(o => {
              const currentStatus = (o.status || 'pending').toLowerCase();

              return (
                <div key={o._id} className="admin-order-card">
                  {/* Order Top Bar */}
                  <div className="order-header-row">
                    <div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>ORDER ID</div>
                      <strong style={{ fontSize: 16, color: '#1e293b' }}>#{o._id}</strong>
                      <div className="order-user-details" style={{ marginTop: 4 }}>
                        👤 <strong>{o.user?.name || 'Guest User'}</strong> {o.user?.email ? `(${o.user.email})` : ''}
                      </div>
                    </div>

                    <div className="status-container">
                      <label className="status-label">Status:</label>
                      <select
                        className={`status-select ${currentStatus}`}
                        value={currentStatus}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="confirmed">✅ Confirmed</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="out-for-delivery">🚴 Out For Delivery</option>
                        <option value="delivered">🎉 Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, marginBottom: 14 }}>
                    <div style={{ fontWeight: 'bold', fontSize: 14, color: '#334155', marginBottom: 8 }}>
                      Items ({o.items?.length || 0}):
                    </div>
                    {o.items && o.items.length > 0 ? (
                      o.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '4px 0', borderBottom: idx < o.items.length - 1 ? '1px dashed #e2e8f0' : 'none' }}>
                          <span>• <strong>{it.name || 'Item'}</strong> × {it.qty}</span>
                          <span style={{ fontWeight: 'bold', color: '#475569' }}>₹{it.price * it.qty}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: 14, color: '#94a3b8' }}>No item details</div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #cbd5e1', paddingTop: 8, marginTop: 8, fontSize: 15, fontWeight: 'bold' }}>
                      <span>Total Amount:</span>
                      <span style={{ color: '#8b6b1c' }}>₹{o.totalPrice || 0}</span>
                    </div>
                  </div>

                  {/* Order Tracking Updates Log */}
                  <div style={{ fontSize: 13, color: '#64748b' }}>
                    <strong>Tracking History:</strong>
                    {o.tracking && o.tracking.length > 0 ? (
                      <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {o.tracking.map((t, idx) => (
                          <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: 6 }}>
                            <span style={{ color: '#94a3b8', fontSize: 12 }}>{new Date(t.at || t.createdAt || Date.now()).toLocaleString()}:</span>{' '}
                            <strong>{t.status}</strong> {t.note ? `(${t.note})` : ''}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{ marginLeft: 6, fontStyle: 'italic' }}>No tracking logs yet</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Products Inventory Section */}
      {activeTab === 'products' && (
        <div>
          {loading ? (
            <p style={{ color: '#64748b' }}>Loading products...</p>
          ) : products.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              No products found in catalog.
            </div>
          ) : (
            <div className="admin-products-grid">
              {products.map(p => (
                <div key={p._id} className="admin-product-card">
                  <img src={p.image} alt={p.name} className="admin-product-img" />
                  <h4 style={{ margin: '0 0 6px', fontSize: 16, color: '#1e293b' }}>{p.name}</h4>
                  <div style={{ fontSize: 15, fontWeight: 'bold', color: '#8b6b1c', marginBottom: 6 }}>
                    ₹{p.price}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                    <span>Stock: <strong>{p.countInStock}</strong></span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 'bold',
                        background: p.countInStock > 0 ? '#dcfce7' : '#fee2e2',
                        color: p.countInStock > 0 ? '#166534' : '#991b1b'
                      }}
                    >
                      {p.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
