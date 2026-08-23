const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
  try {
    const q = req.query.q;
    let filter = {};
    if(q) filter = { name: { $regex: q, $options: 'i' } };
    const products = await Product.find(filter);
    res.json(products);
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if(!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// SEED - create sample products
router.post('/seed', async (req, res) => {
  try {
    const sample = [
      // Demo books
      { name: 'The Little Prince', description: 'A classic tale by Antoine de Saint-Exupéry', price: 250, image: 'https://via.placeholder.com/600x600.png?text=The+Little+Prince', countInStock: 50 },
      { name: 'The Alchemist', description: 'A fable about following your dream by Paulo Coelho', price: 300, image: 'https://via.placeholder.com/600x600.png?text=The+Alchemist', countInStock: 40 },
      { name: 'Atomic Habits', description: 'An easy & proven way to build good habits', price: 450, image: 'https://via.placeholder.com/600x600.png?text=Atomic+Habits', countInStock: 35 },
      { name: 'Rich Dad Poor Dad', description: 'Personal finance classic by Robert Kiyosaki', price: 350, image: 'https://via.placeholder.com/600x600.png?text=Rich+Dad+Poor+Dad', countInStock: 30 },
      { name: 'The Prophet', description: 'Poetic philosophical book by Kahlil Gibran', price: 200, image: 'https://via.placeholder.com/600x600.png?text=The+Prophet', countInStock: 45 },
      { name: 'Thinking, Fast and Slow', description: 'A landmark book on human thinking by Daniel Kahneman', price: 499, image: 'https://via.placeholder.com/600x600.png?text=Thinking+Fast+and+Slow', countInStock: 25 },

      // Existing perfume items
      { name: 'Oud Elegance', description: 'Rich oud with floral hints', price: 1200, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759056266/Gemini_Generated_Image_fhwbnnfhwbnnfhwb_unvamv.png', countInStock: 20 },
      { name: 'Rose Velvet', description: 'Soft rose and musk', price: 900, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759056266/Gemini_Generated_Image_eoneafeoneafeone_l1ol8p.png', countInStock: 15 },
      { name: 'Citrus Breeze', description: 'Fresh citrus unisex', price: 700, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759242033/Gemini_Generated_Image_gj26cggj26cggj26_hupjbp.png', countInStock: 30 }

    ];
    await Product.deleteMany({});
    await Product.insertMany(sample);
    res.json({ message: 'Seeded' });
  } catch(err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;