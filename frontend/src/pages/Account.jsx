import React, { useState } from "react";
import Header from "../components/Header";
import { API_BASE } from "../api";

export default function Account() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [editing, setEditing] = useState(false);

  // Separate address fields
  const [city, setCity] = useState("");
  const [dist, setDist] = useState("");
  const [stateName, setStateName] = useState("");
  const [zip, setZip] = useState("");

  // Start editing - prefill fields
  const startEditing = () => {
  const addr = user?.address?.address || "";
  if (addr) {
    const lines = addr.split("\n");
    setCity(lines[0]?.split(": ")[1] || "");
    setDist(lines[1]?.split(": ")[1] || "");
    setStateName(lines[2]?.split(": ")[1] || "");
    setZip(lines[3]?.split(": ")[1] || "");
  }
  setEditing(true);
};


  // Save address
  const saveAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    const address = `city: ${city}\ndist: ${dist}\nstate: ${stateName}\nzip: ${zip}\n`;

    try {
      const res = await fetch(`${API_BASE}/api/auth/address`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Address updated successfully!");
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        setEditing(false);
      } else {
        alert(data.message || "Error updating address");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <>
   
      <div style={{ width: "100%", maxWidth: 500, margin: "20px auto", padding: "0 16px", boxSizing: "border-box" }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Your Account</h2>

        {user ? (
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>

            {!editing ? (
              <>
                <p><b>Address:</b></p>
                <pre
  style={{
    background: "#f4f4f4",
    padding: 10,
    borderRadius: 6,
    whiteSpace: "pre-wrap",
  }}
>
  {user.address?.address || "Not set"}
</pre>

                <button
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: 5,
                    cursor: "pointer",
                    marginTop: 10,
                  }}
                  onClick={startEditing}
                >
                  {user.address ? "Edit Address" : "Add Address"}
                </button>
              </>
            ) : (
              <form onSubmit={saveAddress} style={{ marginTop: 10 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input
                    className="input"
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <input
                    className="input"
                    type="text"
                    placeholder="District"
                    value={dist}
                    onChange={(e) => setDist(e.target.value)}
                    required
                  />
                  <input
                    className="input"
                    type="text"
                    placeholder="State"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    required
                  />
                  <input
                    className="input"
                    type="text"
                    placeholder="ZIP Code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginTop: 12 }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: 5,
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    style={{
                      backgroundColor: "#777",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: 5,
                      marginLeft: 8,
                      cursor: "pointer",
                    }}
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <p>Please <a href="/login">login</a></p>
        )}
      </div>
    </>
  );
}
