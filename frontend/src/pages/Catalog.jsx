import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api";

function Catalog({ searchQuery }) {
  const [products, setProducts] = useState([]);

  

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

   const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  
  const addToCart = async (id) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      `${API_BASE}/api/cart`,
      { productId: id },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      }
    );
    alert("Added to cart!");
  } catch (err) {
    console.error(err);
    alert("Please login to add items to cart.");
  }
};

  return (
    <div className="container">
      <h2 className="center" style={{ fontSize: "28px", marginBottom: "20px" }}>
        Product Catalog
      </h2>

      <div className="grid">
        {products.map((product) => (
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

            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button onClick={() => addToCart(product._id)} className="btn">
                Add to Cart
              </button>

              <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
                <button className="btn">View Details</button></Link>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalog;
