// Simple seed runner that inserts sample products using the Product model directly.
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/asrar_perfume';

const sample = [
  // Books & Stationery
  { name: 'The Little Prince', description: 'A classic tale by Antoine de Saint-Exupéry', price: 250, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop', countInStock: 50 },
  { name: 'The Alchemist', description: 'A fable about following your dream by Paulo Coelho', price: 300, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop', countInStock: 40 },
  { name: 'Atomic Habits', description: 'An easy & proven way to build good habits by James Clear', price: 450, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop', countInStock: 35 },
  { name: 'Rich Dad Poor Dad', description: 'Personal finance classic by Robert Kiyosaki', price: 350, image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&auto=format&fit=crop', countInStock: 30 },
  { name: 'The Prophet', description: 'Poetic philosophical book by Kahlil Gibran', price: 200, image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop', countInStock: 45 },
  { name: 'Thinking, Fast and Slow', description: 'Landmark book on human thinking by Daniel Kahneman', price: 499, image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop', countInStock: 25 },
  { name: 'Premium Leather Journal & Pen', description: 'Handmade refillable leather notebook with luxury ballpoint pen', price: 599, image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop', countInStock: 20 },

  // Perfumes & Attars
  { name: 'Royal Oud Elegance', description: 'Rich Arabian oud with subtle rose and woody undertones', price: 1200, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759056266/Gemini_Generated_Image_fhwbnnfhwbnnfhwb_unvamv.png', countInStock: 20 },
  { name: 'Rose Velvet Attar', description: 'Pure concentrated floral rose oil with soft musk notes', price: 900, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759056266/Gemini_Generated_Image_eoneafeoneafeone_l1ol8p.png', countInStock: 15 },
  { name: 'Citrus Breeze EDP', description: 'Fresh zesty citrus unisex perfume for all-day freshness', price: 700, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759242033/Gemini_Generated_Image_gj26cggj26cggj26_hupjbp.png', countInStock: 30 },
  { name: 'Amber Gold Musk', description: 'Warm amber fragrance blended with sweet vanilla & oriental musk', price: 1100, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop', countInStock: 18 },
  { name: 'Midnight Jasmine EDP', description: 'Enchanting night-blooming jasmine floral fragrance', price: 850, image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop', countInStock: 22 },

  // Gifts & Lifestyle Essentials
  { name: 'Scented Soy Wax Candle Set', description: 'Set of 3 hand-poured aromatherapy candles (Lavender, Vanilla, Rose)', price: 499, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop', countInStock: 40 },
  { name: 'Stainless Steel Insulated Flask 750ml', description: 'Double-wall thermal water bottle (Hot & Cold for 24 hrs)', price: 799, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop', countInStock: 35 },
  { name: 'Organic Herbal Tea Sampler Box', description: 'Assorted premium organic green, chamomile, and mint teas', price: 399, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop', countInStock: 50 },
  { name: 'Premium Dry Fruits Gift Box 500g', description: 'Handpicked almonds, cashews, raisins, and pistachios', price: 899, image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=600&auto=format&fit=crop', countInStock: 30 }
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