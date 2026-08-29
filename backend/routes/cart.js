const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

const JWT_SECRET = process.env.JWT_SECRET || 'verysecretkey';

function authMiddleware(req, res, next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ message: 'No token' });
  const token = header.split(' ')[1];
  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ message: 'Token invalid' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch(err) {
    res.status(401).json({ message: 'Token invalid' });
  }
}

// In-memory cart for demo
const carts = {};

const sampleDemoProducts = [
  { _id: 'demo-1', name: 'Royal Oud Elegance', price: 1200, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759056266/Gemini_Generated_Image_fhwbnnfhwbnnfhwb_unvamv.png' },
  { _id: 'demo-2', name: 'Rose Velvet Attar', price: 900, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759056266/Gemini_Generated_Image_eoneafeoneafeone_l1ol8p.png' },
  { _id: 'demo-3', name: 'Citrus Breeze EDP', price: 700, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759242033/Gemini_Generated_Image_gj26cggj26cggj26_hupjbp.png' },
  { _id: 'demo-4', name: 'Amber Gold Musk', price: 1100, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop' },
  { _id: 'demo-5', name: 'Midnight Jasmine EDP', price: 850, image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop' },
  { _id: 'demo-6', name: 'The Little Prince', price: 250, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop' },
  { _id: 'demo-7', name: 'Atomic Habits', price: 450, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop' },
  { _id: 'demo-8', name: 'Scented Soy Wax Candle Set', price: 499, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop' }
];

router.post('/', authMiddleware, async (req, res) => {
  const { productId } = req.body;
  if(!productId) return res.status(400).json({ message: 'Product required' });

  if(!carts[req.userId]) carts[req.userId] = [];
  carts[req.userId].push(productId.toString());
  res.json({ message: 'Added to cart' });
});

// Decrement one instance of a product from cart
router.post('/decrement/:productId', authMiddleware, async (req, res) => {
  const pid = req.params.productId;
  if(!carts[req.userId] || carts[req.userId].length === 0) return res.status(400).json({ message: 'Cart empty' });
  const idx = carts[req.userId].indexOf(pid);
  if(idx === -1) return res.status(404).json({ message: 'Product not in cart' });
  carts[req.userId].splice(idx, 1);
  res.json({ message: 'Decremented' });
});

// Remove item from cart
router.delete('/:productId', authMiddleware, async (req, res) => {
  const pid = req.params.productId;
  if (!carts[req.userId]) return res.status(400).json({ message: 'Cart empty' });
  carts[req.userId] = carts[req.userId].filter(id => id.toString() !== pid);
  res.json({ message: 'Removed from cart' });
});

// GET /api/cart - get current user's cart with product details
router.get('/', authMiddleware, async (req, res) => {
  const userCart = carts[req.userId] || [];
  const validObjectIds = userCart.filter(id => mongoose.Types.ObjectId.isValid(id));
  
  let products = [];
  try {
    if (validObjectIds.length > 0) {
      products = await Product.find({ _id: { $in: validObjectIds } });
    }
  } catch (err) {
    console.error('Error fetching cart products from DB:', err);
  }

  const qtyMap = {};
  userCart.forEach(pid => {
    const key = pid.toString();
    qtyMap[key] = (qtyMap[key] || 0) + 1;
  });

  const uniquePids = [...new Set(userCart.map(id => id.toString()))];
  const cartItems = [];

  for (const pid of uniquePids) {
    const dbP = products.find(p => p._id.toString() === pid);
    if (dbP) {
      cartItems.push({
        product: dbP._id.toString(),
        name: dbP.name,
        price: dbP.price,
        image: dbP.image,
        qty: qtyMap[pid] || 1
      });
    } else {
      const demoP = sampleDemoProducts.find(d => d._id === pid);
      if (demoP) {
        cartItems.push({
          product: demoP._id,
          name: demoP.name,
          price: demoP.price,
          image: demoP.image,
          qty: qtyMap[pid] || 1
        });
      }
    }
  }

  res.json(cartItems);
});

module.exports = router;
