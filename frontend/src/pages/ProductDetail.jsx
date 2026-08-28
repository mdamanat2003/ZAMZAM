import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
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
    if(!token){ navigate('/login'); return }
    try {
      const res = await fetch(API_BASE + '/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ productId: p._id })
      })
      const data = await res.json()
      if(res.ok){
        alert('Added to cart')
      } else {
        alert(data.message || 'Failed to add to cart')
      }
    } catch (err) {
      console.error(err)
      alert('Network error')
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
      alert('Network error')
    }
  }

  async function addToWishlist(){
    const token = localStorage.getItem('token')
    if(!token){ navigate('/login'); return; }
    await fetch(API_BASE + '/api/wishlist/'+id, { method:'POST', headers:{ Authorization:'Bearer '+token } })
    alert('Added to wishlist')
  }

  async function submitReview(e){
    e.preventDefault()
    const token = localStorage.getItem('token')
    if(!token){ navigate('/login'); return; }
    const res = await fetch(API_BASE + '/api/reviews/' + id, { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token }, body: JSON.stringify({ rating, comment }) })
    if(res.ok){ alert('Review added'); const updated = await fetch(API_BASE + '/api/products/' + id).then(r=>r.json()); setP(updated) }
    else { const data = await res.json(); alert(data.message || 'Error') }
  }

  if(!p) return <div><Header /><div className="container center">Loading...</div></div>

  return (
    <>
      
      <div className="container responsive-two-col">
        <div className="responsive-col-main" style={{ minWidth: 260 }}>
          <img src={p.image} style={{ width: '100%', maxHeight: 450, objectFit: 'cover', borderRadius: 8 }} />
        </div>
        <div className="responsive-col-main" style={{ minWidth: 280 }}>
          <h2>{p.name}</h2>
          <p className="small">{p.description}</p>
          <p><b>₹{p.price}</b></p>
          <p>Rating: {p.rating ? p.rating.toFixed(1) : '—'} ({p.reviews.length} reviews)</p>
          <p>In stock: {p.countInStock}</p>
          <div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>
            <button className="btn" onClick={buyNow}>Buy Now</button>
            <button className="btn" onClick={addToCart} style={{background:'#444'}}>Add to cart</button>
            <button className="btn" onClick={addToWishlist} style={{background:'#8b6b1c'}}>Add to wishlist</button>
          </div>

          <div style={{marginTop:20}}>
            <h3>Reviews</h3>
            {p.reviews.length === 0 ? <p className="small">No reviews yet.</p> : p.reviews.map(r=>(
              <div key={r._id} className="card" style={{marginBottom:8}}>
                <b>{r.name}</b> <span className="small"> — {r.rating} ⭐</span>
                <div className="small">{r.comment}</div>
              </div>
            ))}
            <form onSubmit={submitReview} style={{marginTop:12}}>
              <h4>Leave a review</h4>
              <select value={rating} onChange={e=>setRating(Number(e.target.value))} className="input">
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Very good</option>
                <option value={3}>3 - Good</option>
                <option value={2}>2 - Fair</option>
                <option value={1}>1 - Poor</option>
              </select>
              <textarea className="input" rows="3" placeholder="Comment" value={comment} onChange={e=>setComment(e.target.value)} />
              <div style={{marginTop:8}}><button className="btn" type="submit">Submit Review</button></div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
