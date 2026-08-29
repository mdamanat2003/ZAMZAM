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

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    smell: "",
    price: "",
    weight: "",
    age: "",
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
    navigate("/product/" + p._id);
  }

  const resetFilters = () => {
    setFilters({
      category: "",
      smell: "",
      price: "",
      weight: "",
      age: "",
      newLaunch: false,
    });
  };

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.smell ? 1 : 0) +
    (filters.price ? 1 : 0) +
    (filters.weight ? 1 : 0) +
    (filters.age ? 1 : 0) +
    (filters.newLaunch ? 1 : 0);

  const filteredProducts = products.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !(p.description && p.description.toLowerCase().includes(q.toLowerCase()))) {
      return false;
    }
    if (filters.category && p.category && p.category.toLowerCase() !== filters.category.toLowerCase()) {
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
    if (filters.weight && (p.weight || p.size) && !String(p.weight || p.size).toLowerCase().includes(filters.weight.toLowerCase())) {
      return false;
    }
    if (filters.age && p.age && p.age.toLowerCase() !== filters.age.toLowerCase()) {
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
        {/* Sticky 2-Part Sub-Nav Bar */}
        <div className="sub-nav-wrapper">
          <div className="sub-nav-bar">
            {/* Part 1: Product Wise Category Selector */}
            <div className="sub-nav-part part-sort">
              <span className="sub-nav-label">Category:</span>
              <select
                className="sub-nav-select"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="Bakery">Bakery</option>
                <option value="Clothing">Clothing</option>
                <option value="Khajur">Khajur (Dates)</option>
                <option value="Books">Books</option>
                <option value="Perfumes">Perfumes</option>
                <option value="Attar">Attar</option>
                <option value="Candles">Candles & Home</option>
              </select>
            </div>

            {/* Part 2: Filters Trigger Button */}
            <div className="sub-nav-part part-filter">
              <button
                className={`sub-nav-filter-btn ${activeFilterCount > 0 ? "active" : ""}`}
                onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              >
                <span>⚡ Filters</span>
                {activeFilterCount > 0 && (
                  <span className="filter-badge">{activeFilterCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="active-filters-bar">
              <span className="active-filters-title">Filters:</span>
              {filters.category && (
                <span className="filter-tag" onClick={() => setFilters({ ...filters, category: "" })}>
                  {filters.category} ✕
                </span>
              )}
              {filters.price && (
                <span className="filter-tag" onClick={() => setFilters({ ...filters, price: "" })}>
                  ₹{filters.price} ✕
                </span>
              )}
              {filters.weight && (
                <span className="filter-tag" onClick={() => setFilters({ ...filters, weight: "" })}>
                  {filters.weight} ✕
                </span>
              )}
              {filters.smell && (
                <span className="filter-tag" onClick={() => setFilters({ ...filters, smell: "" })}>
                  {filters.smell} ✕
                </span>
              )}
              {filters.age && (
                <span className="filter-tag" onClick={() => setFilters({ ...filters, age: "" })}>
                  {filters.age} ✕
                </span>
              )}
              {filters.newLaunch && (
                <span className="filter-tag" onClick={() => setFilters({ ...filters, newLaunch: false })}>
                  New ✕
                </span>
              )}
              <button className="btn-clear-all" onClick={resetFilters}>Clear All</button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="home-main">
          <div className="hero">
            <div>
              <h1>Discover Everyday Essentials & Luxury Scents</h1>
              <p>Handpicked perfumes, dates, books, bakery & more — delivered to your door.</p>
              <div style={{ marginTop: 12 }}>
                <Link to="/catalog">
                  <button className="btn">Browse All Products</button>
                </Link>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>
              {filters.category ? `${filters.category} Products` : "Featured Products"}
            </h2>
            <span style={{ color: "#666", fontSize: "14px" }}>
              Showing {filteredProducts.length} items
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products-msg">
              <p>No products found matching your active filters.</p>
              <button className="btn" onClick={resetFilters}>Reset All Filters</button>
            </div>
          ) : (
            <div className="grid">
              {filteredProducts.map((p) => (
                <div className="card" key={p._id}>
                  <Link to={"/product/" + p._id} style={{ textDecoration: "none", color: "inherit" }}>
                    <img src={p.image} alt={p.name} style={{ cursor: "pointer" }} />
                    <h3>{p.name}</h3>
                  </Link>
                  {p.category && (
                    <span className="product-category-badge">{p.category}</span>
                  )}
                  <p className="small">{p.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                    <p style={{ margin: 0, fontWeight: "bold", fontSize: "18px", color: "#a67c2a" }}>
                      ₹{p.price}
                    </p>
                    {(p.weight || p.size) && (
                      <span style={{ fontSize: "12px", background: "#f0f0f0", padding: "2px 6px", borderRadius: "4px", color: "#666" }}>
                        {p.weight || p.size}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <button className="btn" style={{ flex: 1 }} onClick={() => handleBuyNow(p)}>
                      Buy Now
                    </button>
                    <button className="btn" style={{ background: "#444", flex: 1 }} onClick={() => addToCart(p)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Drawer Overlay & Modal */}
        {isFilterDrawerOpen && (
          <div className="filter-drawer-backdrop" onClick={() => setIsFilterDrawerOpen(false)}>
            <div className="filter-drawer-content" onClick={(e) => e.stopPropagation()}>
              <div className="filter-drawer-header">
                <h3>Filter Products</h3>
                <button className="close-drawer-btn" onClick={() => setIsFilterDrawerOpen(false)}>✕</button>
              </div>

              <div className="filter-drawer-body">
                {/* Category Filter */}
                <div className="filter-section">
                  <h4>Category</h4>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  >
                    <option value="">All Categories</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Khajur">Khajur (Dates)</option>
                    <option value="Books">Books</option>
                    <option value="Perfumes">Perfumes</option>
                    <option value="Attar">Attar</option>
                    <option value="Candles">Candles & Home</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="filter-section">
                  <h4>Price Range</h4>
                  <select
                    value={filters.price}
                    onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                  >
                    <option value="">All Prices</option>
                    <option value="0-500">Under ₹500</option>
                    <option value="500-1000">₹500 - ₹1000</option>
                    <option value="1000-2000">₹1000 - ₹2000</option>
                    <option value="2000+">Above ₹2000</option>
                  </select>
                </div>

                {/* Weight / Size */}
                <div className="filter-section">
                  <h4>Weight / Size</h4>
                  <select
                    value={filters.weight}
                    onChange={(e) => setFilters({ ...filters, weight: e.target.value })}
                  >
                    <option value="">All Sizes & Weights</option>
                    <option value="10ml">10 ml</option>
                    <option value="50ml">50 ml</option>
                    <option value="100ml">100 ml</option>
                    <option value="250g">250g</option>
                    <option value="500g">500g</option>
                    <option value="1kg">1 kg</option>
                  </select>
                </div>

                {/* Fragrance / Smell */}
                <div className="filter-section">
                  <h4>Smell / Fragrance Type</h4>
                  <div className="radio-group">
                    {["", "Floral", "Woody", "Fresh", "Oriental"].map((type) => (
                      <label key={type || "all-smell"}>
                        <input
                          type="radio"
                          name="smell"
                          value={type}
                          checked={filters.smell === type}
                          onChange={(e) => setFilters({ ...filters, smell: e.target.value })}
                        />
                        {type === "" ? "Any Smell" : type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Target / Age Group */}
                <div className="filter-section">
                  <h4>Target Group</h4>
                  <div className="radio-group">
                    {["", "Men", "Women", "Unisex"].map((group) => (
                      <label key={group || "all-group"}>
                        <input
                          type="radio"
                          name="age"
                          value={group}
                          checked={filters.age === group}
                          onChange={(e) => setFilters({ ...filters, age: e.target.value })}
                        />
                        {group === "" ? "All Groups" : group}
                      </label>
                    ))}
                  </div>
                </div>

                {/* New Launch */}
                <div className="filter-section">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.newLaunch}
                      onChange={(e) => setFilters({ ...filters, newLaunch: e.target.checked })}
                    />
                    Show Only New Launches 🌟
                  </label>
                </div>
              </div>

              <div className="filter-drawer-footer">
                <button className="btn-clear" onClick={resetFilters}>
                  Clear All
                </button>
                <button className="btn" onClick={() => setIsFilterDrawerOpen(false)}>
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

