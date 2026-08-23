// Simple seed runner that inserts sample products using the Product model directly.
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/asrar_perfume';

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
    
mongoose.connect(MONGODB_URI).then(async () => {
  console.log('Connected for seeding');
  await Product.deleteMany({});
  await Product.insertMany(sample);
  console.log('Seeded products');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});