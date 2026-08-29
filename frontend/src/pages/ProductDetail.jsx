import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { API_BASE } from '../api'
import { demoProducts } from '../data/demoProducts'

export default function ProductDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [p, setP] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  useEffect(()=>{
    fetch(API_BASE + '/api/products/' + id)
      .then(r => {
        if (!r.ok) throw new Error("Product fetch failed");
        return r.json();
      })
      .then(data => {
        if (data && data._id) setP(data);
        else {
          const demo = demoProducts.find(item => item._id === id);
          if (demo) setP(demo);
        }
      })
      .catch(err => {
        console.error(err);
        const demo = demoProducts.find(item => item._id === id);
        if (demo) setP(demo);
      })
  }, [id])

  async function addToCart(){
    const token = localStorage.getItem('token')
    if(!token || token === 'null' || token === 'undefined'){
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login')
      return
    }
    try {
      const res = await fetch(API_BASE + '/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ productId: p._id })
      })
      const data = await res.json()
      if(res.ok){
        alert('Added to cart!')
      } else if (res.status === 401 || data.message === 'Token invalid') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        alert('Session expired. Please log in to add items to cart.')
        navigate('/login')
      } else {
        alert(data.message || 'Failed to add to cart')
      }
    } catch (err) {
      console.error(err)
      alert('Added to cart (Demo mode)')
    }
  }

  async function buyNow(){
    const token = localStorage.getItem('token')
    if(!token){ navigate('/login'); return }
    try {
      const res = await fetch(API_BASE + '/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ productId: p._id })
      })
      if(res.ok){
        navigate('/checkout')
      } else {
        const data = await res.json()
        alert(data.message || 'Failed to proceed to buy')
      }
    } catch (err) {
      console.error(err)
      navigate('/checkout')
    }
  }

  async function addToWishlist(){
    const token = localStorage.getItem('token')
    if(!token){ navigate('/login'); return; }
    try {
      await fetch(API_BASE + '/api/wishlist/'+id, { method:'POST', headers:{ Authorization:'Bearer '+token } })
      alert('Added to wishlist!')
    } catch (err) {
      alert('Added to wishlist (Demo mode)')
    }
  }

  async function submitReview(e){
    e.preventDefault()
    if (!comment.trim()) return;
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const reviewerName = user ? user.name : 'Anonymous Guest'

    try {
      if (token) {
        const res = await fetch(API_BASE + '/api/reviews/' + id, {
          method:'POST',
          headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
          body: JSON.stringify({ rating, comment })
        })
        if(res.ok){
          const updated = await fetch(API_BASE + '/api/products/' + id).then(r=>r.json());
          setP(updated)
          setComment('')
          alert('Review submitted successfully!')
          return
        }
      }
    } catch (err) {
      console.log('API review failed, updating local state for demo:', err)
    }

    // Fallback for demo products or offline mode
    const newRev = { _id: 'rev_' + Date.now(), name: reviewerName, rating, comment }
    const updatedReviews = [...(p.reviews || []), newRev]
    const avgRating = updatedReviews.reduce((acc, curr) => acc + curr.rating, 0) / updatedReviews.length
    setP({ ...p, reviews: updatedReviews, rating: avgRating })
    setComment('')
    alert('Thank you! Your review has been added.')
  }

  if(!p) return <div className="container center" style={{ padding: '40px 0' }}>Loading product details...</div>

  const reviewsList = p.reviews || []

  return (
    <div className="container" style={{ marginTop: 20, marginBottom: 40 }}>
      {/* Top Section: Product Image & Info */}
      <div className="responsive-two-col" style={{ gap: 30 }}>
        <div className="responsive-col-main" style={{ minWidth: 280 }}>
          <img
            src={p.image}
            alt={p.name}
            style={{ width: '100%', maxHeight: 480, objectFit: 'cover', borderRadius: 12, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
          />
        </div>

        <div className="responsive-col-main" style={{ minWidth: 280 }}>
          <h2 style={{ fontSize: 28, marginBottom: 8 }}>{p.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ background: '#f5b041', color: '#fff', padding: '2px 8px', borderRadius: 4, fontWeight: 'bold', fontSize: 14 }}>
              ★ {p.rating ? p.rating.toFixed(1) : '4.8'}
            </span>
            <span style={{ color: '#666', fontSize: 14 }}>({reviewsList.length} customer reviews)</span>
          </div>

          <h3 style={{ fontSize: 24, color: '#2c3e50', marginBottom: 16 }}>₹{p.price}</h3>

          <p style={{ lineHeight: 1.6, color: '#444', marginBottom: 20 }}>{p.description}</p>

          {/* Extra Product Info Specifications */}
          <div style={{ background: '#fafafa', border: '1px solid #eee', padding: 16, borderRadius: 8, marginBottom: 20 }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Product Highlights & Specifications</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, fontSize: 14 }}>
              {p.smell && (
                <div>
                  <strong>Smell Type:</strong> {p.smell}
                </div>
              )}
              {p.size && (
                <div>
                  <strong>Size / Volume:</strong> {p.size} ml
                </div>
              )}
              {p.age && (
                <div>
                  <strong>Target Audience:</strong> {p.age}
                </div>
              )}
              <div>
                <strong>Stock Status:</strong> <span style={{ color: '#27ae60', fontWeight: 'bold' }}>In Stock</span> ({p.countInStock || 10} left)
              </div>
            </div>

            {p.notes && (
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed #ddd', fontSize: 14 }}>
                <strong>Fragrance Notes / Key Blend:</strong> {p.notes}
              </div>
            )}
          </div>

          {/* Trust Badges */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, fontSize: 13, color: '#555' }}>
            <span>🚚 Free Express Shipping</span>
            <span>🛡️ 100% Authentic Guarantee</span>
            <span>⌛ Long-Lasting Fragrance</span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn" onClick={buyNow} style={{ padding: '12px 24px', fontSize: 16 }}>
              Buy Now / Checkout
            </button>
            <button className="btn" onClick={addToCart} style={{ background: '#444', padding: '12px 20px' }}>
              Add to Cart
            </button>
            <button className="btn" onClick={addToWishlist} style={{ background: '#8b6b1c', padding: '12px 20px' }}>
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Down Below: Product Reviews Section */}
      <div style={{ marginTop: 45, paddingTop: 30, borderTop: '2px solid #eee' }}>
        <h3 style={{ fontSize: 22, marginBottom: 15 }}>Customer Reviews ({reviewsList.length})</h3>

        {reviewsList.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No reviews yet. Be the first to review this product!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
            {reviewsList.map((r, idx) => (
              <div key={r._id || idx} className="card" style={{ padding: 16, borderLeft: '4px solid #f5b041' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <strong style={{ fontSize: 16 }}>{r.name}</strong>
                  <span style={{ color: '#f5b041', fontWeight: 'bold' }}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)} ({r.rating}/5)
                  </span>
                </div>
                <div style={{ color: '#444', fontSize: 14 }}>{r.comment}</div>
              </div>
            ))}
          </div>
        )}

        {/* Leave a Review Form */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', padding: 20, borderRadius: 8, maxWidth: 600 }}>
          <h4 style={{ marginTop: 0, marginBottom: 12 }}>Write a Customer Review</h4>
          <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold', fontSize: 14 }}>Your Rating:</label>
              <select value={rating} onChange={e=>setRating(Number(e.target.value))} className="input" style={{ width: '100%' }}>
                <option value={5}>★★★★★ (5/5) Excellent</option>
                <option value={4}>★★★★☆ (4/5) Very Good</option>
                <option value={3}>★★★☆☆ (3/5) Good</option>
                <option value={2}>★★☆☆☆ (2/5) Fair</option>
                <option value={1}>★☆☆☆☆ (1/5) Poor</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold', fontSize: 14 }}>Your Review:</label>
              <textarea
                className="input"
                rows="4"
                placeholder="Share details of your experience with this product..."
                value={comment}
                onChange={e=>setComment(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <button className="btn" type="submit" style={{ padding: '10px 20px' }}>
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
