# E-commerce - MERN Demo (Local)

This is a simple MERN demo application for E-commerce. It includes:

- Backend (Node.js + Express + MongoDB via Mongoose)
- Frontend (React + Vite)
- Local authentication (JWT)
- Cart saved in browser localStorage
- Checkout with map-based location picking (Leaflet + OpenStreetMap) or manual city/district/state/pin
- Payment modes: COD (real) and Online (simulated)

## Requirements
- Node.js (v16+)
- npm
- MongoDB running locally (default: `mongodb://127.0.0.1:27017`)

## Steps to run

### 1. Start MongoDB
If you have `mongod` / MongoDB installed, start the service:
```bash
# on many systems
sudo service mongod start
# or run directly
mongod --dbpath /path/to/your/mongodb/data
```

### 2. Backend
Open a terminal, go to `backend` folder:
```bash
cd backend
npm install
# seed sample products
npm run seed
# then start server
npm run dev    # or npm start
```
Backend will run on port 5000 by default.

### 3. Frontend
Open another terminal, go to `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
Frontend will open on http://localhost:5173 by default.

### 4. Use the app
- Visit http://localhost:5173
- Enter store → browse products, add to cart
- Click cart → Proceed to Checkout (you must be logged in)
- Register / Login
- At checkout you can pick a location on the map or fill manual address fields.
- Choose COD or Online (Online is simulated; it shows a confirmation prompt to simulate success).
- On success, an order is created in the backend (MongoDB).

## Notes & Next steps
- The "Online" payment is a simulation. To integrate real payments use Stripe/Paytm/Razorpay SDKs.
- For production, store secrets in environment variables and enable HTTPS.
- You can change the backend MongoDB URI via `MONGODB_URI` environment variable.

.

## Admin seeding helper
There's a script `backend/seed_admin.js` that will create an admin user.
Default credentials:
- email: admin@example.com
- password: admin123

Run it with (ensure MongoDB is available):
```
cd backend
node seed_admin.js
```

