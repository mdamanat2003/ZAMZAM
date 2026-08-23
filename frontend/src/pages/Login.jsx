import React, { useState } from 'react'
import Header from '../components/Header'
import { API_BASE } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try {
      const url = API_BASE + '/api/auth/' + (isRegister ? 'register' : 'login')
      const res = await fetch(url, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if(res.ok){
        // save token and user
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/') // go to home
      } else {
        alert(data.message || 'Login/Register failed')
      }
    } catch (err) {
      console.error(err);
      alert('Network error')
    }
  }

  return (
    <>
      
      <div className="container" style={{ width: '100%', maxWidth: 480 }}>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isRegister && <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />}
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
          <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
            <button className="btn" type="submit" style={{ flex: 1 }}>{isRegister ? 'Register' : 'Login'}</button>
            <button className="btn" type="button" style={{ background: '#666', flex: 1 }} onClick={()=>setIsRegister(!isRegister)}>{isRegister ? 'Switch to Login' : 'Switch to Register'}</button>
          </div>
        </form>
        <hr />
        <div style={{marginTop:12}}>
          <a href="/admin-login">Admin Login</a>
        </div>
      </div>
    </>
  )
}
