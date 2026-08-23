import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { API_BASE } from "../api";
import "./Home.css"; // ✅ import the CSS file

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const [filters, setFilters] = useState({
    smell: "",
    price: "",
    age: "",
    size: "",
    newLaunch: false,
  });

  useEffect(() => {
    fetch(API_BASE + "/api/products" + (q ? "?q=" + encodeURIComponent(q) : ""))
      .then((r) => r.json())
      .then(setProducts)
      .catch((err) => console.error(err));
  }, [q, filters]);

  function addToCart(p) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i) => i.product === p._id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        product: p._id,
        name: p.name,
        price: p.price,
        qty: 1,
        image: p.image,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  }

  return (
    <>
      <Header />

      <div className="home-container">
        {/* Left: Products */}
        <div className="home-main">
          <div className="hero">
            <div>
              <h1>Discover Luxury Scents</h1>
              <p>Handpicked perfumes — premium quality, delivered to your door.</p>
              <div style={{ marginTop: 12 }}>
                <Link to="/catalog">
                  <button className="btn">Shop Now</button>
                </Link>
              </div>
            </div>
          </div>

          <h2>Featured Perfumes</h2>
          <div className="grid">
            {products.map((p) => (
              <div className="card" key={p._id}>
                <img src={p.image} alt={p.name} />
                <h3>{p.name}</h3>
                <p className="small">{p.description}</p>
                <p>
                  <b>₹{p.price}</b>
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn" onClick={() => addToCart(p)}>
                    Add to cart
                  </button>
                  <Link to={"/product/" + p._id}>
                    <button className="btn" style={{ background: "#a67c2a" }}>
                      View
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Sidebar Filters */}
        <div className="filter-sidebar">
          <h3>Filter Perfumes</h3>

          <div className="filter-section">
            <h4>Smell Type</h4>
            {["Floral", "Woody", "Fresh", "Oriental"].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="smell"
                  value={type}
                  checked={filters.smell === type}
                  onChange={(e) =>
                    setFilters({ ...filters, smell: e.target.value })
                  }
                />
                {type}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>Price Range</h4>
            <select
              onChange={(e) =>
                setFilters({ ...filters, price: e.target.value })
              }
            >
              <option value="">All</option>
              <option value="0-500">Under ₹500</option>
              <option value="500-1000">₹500 - ₹1000</option>
              <option value="1000-2000">₹1000 - ₹2000</option>
              <option value="2000+">Above ₹2000</option>
            </select>
          </div>

          <div className="filter-section">
            <h4>Age Group</h4>
            {["Men", "Women", "Unisex"].map((group) => (
              <label key={group}>
                <input
                  type="radio"
                  name="age"
                  value={group}
                  checked={filters.age === group}
                  onChange={(e) =>
                    setFilters({ ...filters, age: e.target.value })
                  }
                />
                {group}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>Size</h4>
            {[10, 50, 100].map((ml) => (
              <label key={ml}>
                <input
                  type="radio"
                  name="size"
                  value={ml}
                  checked={filters.size === ml.toString()}
                  onChange={(e) =>
                    setFilters({ ...filters, size: e.target.value })
                  }
                />
                {ml} ml
              </label>
            ))}
          </div>

          <div className="filter-section">
            <label>
              <input
                type="checkbox"
                checked={filters.newLaunch}
                onChange={(e) =>
                  setFilters({ ...filters, newLaunch: e.target.checked })
                }
              />
              Show Only New Launches
            </label>
          </div>

          <button
            className="btn-clear"
            onClick={() =>
              setFilters({
                smell: "",
                price: "",
                age: "",
                size: "",
                newLaunch: false,
              })
            }
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="footer">© Zam-zam General Store</div>
    </>
  );
}
