import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api";
import { demoProducts } from "../data/demoProducts";

function Catalog({ searchQuery = "" }) {
  const [products, setProducts] = useState(demoProducts);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/products`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(demoProducts);
        }
      })
      .catch((err) => {
        console.error("API Error, using demo products:", err);
        setProducts(demoProducts);
      });
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  const addToCart = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${API_BASE}/api/cart`,
        { productId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      alert("Added to cart!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart.");
    }
  };

  const buyNow = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${API_BASE}/api/cart`,
        { productId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      navigate("/checkout");
    } catch (err) {
      console.error(err);
      alert("Failed to proceed to buy.");
    }
  };

  return (
    <div className="container">
      <h2 className="center" style={{ fontSize: "28px", marginBottom: "20px" }}>
        Product Catalog
      </h2>

      <div className="grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="card">
            <img src={product.image} alt={product.name} />

            <h3 style={{ fontSize: "20px", marginTop: "10px" }}>
              {product.name}
            </h3>
            <p className="small">
              {product.description ? product.description.slice(0, 50) : ""}...
            </p>
            <p style={{ fontWeight: "bold", marginTop: "8px" }}>
              ₹{product.price}
            </p>

            <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
              <button onClick={() => buyNow(product._id)} className="btn">
                Buy Now
              </button>
              <button onClick={() => addToCart(product._id)} className="btn" style={{ background: "#444" }}>
                Add to Cart
              </button>
              <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
                <button className="btn" style={{ background: "#a67c2a" }}>View Details</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalog;
