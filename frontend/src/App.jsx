import React, { useState, useEffect } from 'react';
import Layout from "./components/Layout";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import Account from './pages/Account'
import Orders from './pages/Orders'
import Track from './pages/Track'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import ProtectedAdmin from './components/ProtectedAdmin'
import Catalog from "./pages/Catalog";
import About from "./pages/About";
import Help from "./pages/Help";



export default function App(){
  const [searchQuery, setSearchQuery] = useState("");
  return (
    
    <Layout  onSearch={setSearchQuery}>
      <Outlet context={{ searchQuery }} />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home searchQuery={searchQuery} />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/track" element={<Track />} />
        <Route path="/admin" element={<ProtectedAdmin><Admin /></ProtectedAdmin>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/about" element={<About />} />
        <Route path="/Contact" element={<About />} />
        <Route path="/help" element={<Help />} />

      </Routes>
       
    </Layout>
    
  );
}
