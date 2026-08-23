import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_BASE } from "../api";
import { useNavigate } from "react-router-dom";
import L from "leaflet";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState({
    city: "",
    district: "",
    state: "",
    pin: "",
  });
  const [latlng, setLatlng] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const mapRef = useRef(null);

  // 🧾 Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  // 🛒 Fetch cart data and user info
  useEffect(() => {
    async function fetchCart() {
      const token = localStorage.getItem("token");
      if (!token) {
        setCart([]);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setCart(res.data);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setCart([]);
      }
    }

    fetchCart();
    const u = JSON.parse(localStorage.getItem("user") || "null");
    setUser(u);
  }, []);

  // 🗺️ Initialize Leaflet map with user's current location
  useEffect(() => {
  try {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([21.0, 78.0], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      let marker;

      // ✅ Fix: Wait a bit and recalc map size
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 300);

      // 📍 Try to get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            mapRef.current.setView([latitude, longitude], 15);
            marker = L.marker([latitude, longitude])
              .addTo(mapRef.current)
              .bindPopup("Your Current Location")
              .openPopup();
            setLatlng({ lat: latitude, lng: longitude });
          },
          (error) => console.warn("Geolocation failed:", error)
        );
      }

      // 📌 Allow manual selection
      mapRef.current.on("click", function (e) {
        if (marker) mapRef.current.removeLayer(marker);
        marker = L.marker(e.latlng).addTo(mapRef.current);
        setLatlng(e.latlng);
      });
    }
  } catch (err) {
    console.error("Error initializing map:", err);
  }
}, []);


  // 💰 Calculate total price
  const total = cart.reduce((sum, it) => sum + it.price * it.qty, 0);

  // 📦 Place order handler
  async function placeOrder(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const items = cart.map((it) => ({
      product: it.product,
      name: it.name,
      qty: it.qty,
      price: it.price,
    }));

    const shippingAddress = {
      ...address,
      lat: latlng ? latlng.lat : undefined,
      lng: latlng ? latlng.lng : undefined,
    };

    // 💳 Handle Razorpay payment for online method
    if (paymentMethod === "Online") {
      try {
        const orderRes = await axios.post(`${API_BASE}/api/payment/order`, {
          amount: total,
        });
        const { orderId } = orderRes.data;

        const options = {
          key: "rzp_test_xxxxxxxx", // Replace with your actual Razorpay key
          amount: total * 100,
          currency: "INR",
          name: "Zam-zam General Store",
          description: "Order Payment",
          order_id: orderId,
          handler: async function (response) {
            const verifyRes = await axios.post(`${API_BASE}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              alert("Payment successful ✅");
            } else {
              alert("Payment verification failed ❌");
              return;
            }
          },
          theme: {
            color: "#0a0a0a",
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
        return; // Stop until payment success
      } catch (err) {
        console.error("Payment error:", err);
        alert("Payment initiation failed.");
        return;
      }
    }

    // 🧾 For COD (or after payment success)
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        items,
        shippingAddress,
        paymentMethod,
        totalPrice: total,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.removeItem("cart");
      alert("Order placed successfully: " + (data.orderId || ""));
      navigate("/home");
    } else {
      alert(data.message || "Order failed");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h2>Checkout</h2>
      <div className="responsive-two-col">
        {/* Left Section */}
        <div className="responsive-col-main" style={{ minWidth: 280 }}>
          <h3>Shipping</h3>
          <p className="small">Choose location on map or fill manually</p>

          {/* 🗺️ Map */}
          <div
            id="map"
            style={{
              height: 240,
              marginBottom: 12,
              borderRadius: 8,
              overflow: "hidden",
            }}
          ></div>

          {/* Address Fields */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              className="input"
              placeholder="City"
              value={address.city}
              onChange={(e) =>
                setAddress({ ...address, city: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="District"
              value={address.district}
              onChange={(e) =>
                setAddress({ ...address, district: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="State"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="PIN"
              value={address.pin}
              onChange={(e) =>
                setAddress({ ...address, pin: e.target.value })
              }
            />
            {latlng && (
              <p className="small">
                Selected coordinates: {latlng.lat.toFixed(4)},{" "}
                {latlng.lng.toFixed(4)}
              </p>
            )}
          </div>

          {/* Payment Section */}
          <h3>Payment</h3>
          <div className="card">
            <div style={{ display: "flex", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
              <label style={{ cursor: "pointer" }}>
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />{" "}
                Cash on Delivery
              </label>
              <label style={{ cursor: "pointer" }}>
                <input
                  type="radio"
                  checked={paymentMethod === "Online"}
                  onChange={() => setPaymentMethod("Online")}
                />{" "}
                Online
              </label>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <button className="btn" style={{ width: "100%" }} onClick={placeOrder}>
              Place Order (₹{total})
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="responsive-col-side">
          <h3>Order Summary</h3>
          <div className="card">
            {cart.map((it) => (
              <div
                key={it.product}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <img
                  src={it.image}
                  style={{
                    width: 64,
                    height: 48,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div>{it.name}</div>
                  <div className="small">
                    ₹{it.price} × {it.qty}
                  </div>
                </div>
                <div>₹{it.price * it.qty}</div>
              </div>
            ))}
            <hr />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <b>Total</b>
              <b>₹{total}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
