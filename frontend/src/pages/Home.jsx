import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE } from "../api";
import { demoProducts } from "../data/demoProducts";
import "./Home.css"; // ✅ import the CSS file

export default function Home({ searchQuery }) {
  const [products, setProducts] = useState(demoProducts);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchQuery || searchParams.get("q") || "";

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
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(demoProducts);
        }
      })
      .catch((err) => {
        console.error("API error, using demo products:", err);
        setProducts(demoProducts);
      });
  }, [q]);

  async function addToCart(p) {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(API_BASE + "/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ productId: p._id }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Added to cart!");
      } else if (res.status === 401 || data.message === "Token invalid" || data.message === "No token") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired. Please log in to add items to cart.");
        navigate("/login");
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  }

  function handleBuyNow(p) {
    // Clicking Buy automatically opens the product detail view with extra info & reviews down below
    navigate("/product/" + p._id);
  }

  const filteredProducts = products.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !(p.description && p.description.toLowerCase().includes(q.toLowerCase()))) {
      return false;
    }
    if (filters.smell && p.smell && p.smell.toLowerCase() !== filters.smell.toLowerCase()) {
      return false;
    }
    if (filters.price) {
      const price = Number(p.price);
      if (filters.price === "0-500" && !(price <= 500)) return false;
      if (filters.price === "500-1000" && !(price >= 500 && price <= 1000)) return false;
      if (filters.price === "1000-2000" && !(price >= 1000 && price <= 2000)) return false;
      if (filters.price === "2000+" && !(price >= 2000)) return false;
    }
    if (filters.age && p.age && p.age.toLowerCase() !== filters.age.toLowerCase()) {
      return false;
    }
    if (filters.size && p.size && String(p.size) !== String(filters.size)) {
      return false;
    }
    if (filters.newLaunch && !p.newLaunch) {
      return false;
    }
    return true;
  });

  return (
    <>
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
            {filteredProducts.map((p) => (
              <div className="card" key={p._id}>
                <Link to={"/product/" + p._id} style={{ textDecoration: "none", color: "inherit" }}>
                  <img src={p.image} alt={p.name} style={{ cursor: "pointer" }} />
                  <h3>{p.name}</h3>
                </Link>
                <p className="small">{p.description}</p>
                <p>
                  <b>₹{p.price}</b>
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button className="btn" onClick={() => handleBuyNow(p)}>
                    Buy Now
                  </button>
                  <button className="btn" style={{ background: "#444" }} onClick={() => addToCart(p)}>
                    Add to cart
                  </button>
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
    </>
  );
}
