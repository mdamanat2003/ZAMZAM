import React, { useState } from "react";

export default function Help() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [querySubmitted, setQuerySubmitted] = useState(false);

  // Step 1: Categories
  const categories = [
    { id: "order", name: "Help with your Order" },
    { id: "issue", name: "Help with your Issue" },
    { id: "other", name: "Help with Other Issues" },
  ];

  // Step 2: Queries for each category
  const queries = {
    order: [
      "I want to manage my order",
      "I want help with returns & refunds",
      "I want to contact the seller",
    ],
    issue: [
      "Payment failed but money deducted",
      "Product not delivered on time",
      "Received damaged or wrong product",
    ],
    other: [
      "I have a general inquiry",
      "I want to give feedback",
      "I want to delete my account",
    ],
  };

  // Step 3: Function to submit a help ticket
  const handleSubmit = () => {
    setQuerySubmitted(true);
    // here you’ll send the query to backend API
    // e.g. axios.post(`${API_BASE}/api/help`, { userId, category, query });
  };

  return (
    <>
      <div
        style={{
          minHeight: "80vh",
          background: "#f8f9fa",
          padding: "20px 12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            background: "#fff",
            borderRadius: "12px",
            padding: "20px 16px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            boxSizing: "border-box",
          }}
        >
          <h1 style={{ textAlign: "center", color: "#333", marginBottom: 30 }}>
            Help Center
          </h1>

          {!selectedCategory && !querySubmitted && (
            <>
              <h2 style={{ marginBottom: "15px", color: "#555" }}>
                Choose a help category:
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      background: "#fafafa",
                      cursor: "pointer",
                      fontWeight: 500,
                      textAlign: "left",
                    }}
                  >
                    {cat.name} →
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedCategory && !selectedQuery && (
            <>
              <h2 style={{ marginTop: "20px", color: "#555" }}>
                Select your issue:
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {queries[selectedCategory].map((query, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedQuery(query)}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      background: "#fafafa",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {query} →
                  </button>
                ))}
              </div>

              <button
                style={{
                  marginTop: "20px",
                  background: "#c49b63",
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedCategory(null)}
              >
                ← Back
              </button>
            </>
          )}

          {selectedQuery && !querySubmitted && (
            <>
              <h2 style={{ marginTop: "20px", color: "#555" }}>
                Your Selected Issue:
              </h2>
              <p style={{ marginBottom: "15px" }}>{selectedQuery}</p>

              <textarea
                placeholder="Describe your issue in detail..."
                style={{
                  width: "100%",
                  height: "100px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "15px",
                }}
              />

              <button
                style={{
                  background: "#c49b63",
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={handleSubmit}
              >
                Submit Query
              </button>

              <button
                style={{
                  marginLeft: "10px",
                  background: "transparent",
                  border: "1px solid #aaa",
                  color: "#333",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedQuery(null);
                  setSelectedCategory(null);
                }}
              >
                ← Back
              </button>
            </>
          )}

          {querySubmitted && (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <h3>✅ Your query has been submitted successfully!</h3>
              <p>
                Our support team will get back to you soon. You can track your
                query status on your Profile page.
              </p>
              <button
                style={{
                  marginTop: "20px",
                  background: "#c49b63",
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setQuerySubmitted(false);
                  setSelectedCategory(null);
                  setSelectedQuery(null);
                }}
              >
                Go Back to Help
              </button>
            </div>
          )}
        </div>
      </div>
      
    </>
  );
}
