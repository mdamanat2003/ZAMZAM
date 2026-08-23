import React from "react";

export default function About() {
  return (
    <>
      
      <div
        style={{
          minHeight: "100vh",
          padding: "60px 20px",
          backgroundColor: "#f9f9f9",
          color: "#222",
        }}
      >
        <div
          className="container"
          style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}
        >
          <h1 style={{ fontSize: "2.2rem", marginBottom: "20px" }}>
            About <span style={{ color: "#c49b63" }}>Zam-zam General Store</span>
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.8",
              maxWidth: "800px",
              margin: "0 auto 40px",
            }}
          >
            Welcome to <b>Zam-zam General Store</b> – your destination for books,
            gifts, and everyday essentials. Founded with a passion for
            perfection, we believe in bringing you high-quality,
            handpicked items at affordable prices.
          </p>

          <img
            src="https://res.cloudinary.com/defte4omf/image/upload/v1759056266/Gemini_Generated_Image_fhwbnnfhwbnnfhwb_unvamv.png"
            alt="Zam-zam General Store Collection"
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "12px",
              marginBottom: "40px",
            }}
          />

          <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            🌿 Our Story
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: "1.7",
              marginBottom: "30px",
              color: "#444",
            }}
          >
            Started in 2025, Zam-zam General Store was born to provide easy access
            to daily essentials and curated goods. Each product we offer is carefully selected
            to ensure quality and value. We are proud to serve thousands of
            happy customers.
          </p>

          <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            💎 Our Promise
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: "1.7",
              color: "#444",
              marginBottom: "30px",
            }}
          >
            We promise 100% authentic and premium-quality items, fast
            delivery, and an exceptional customer experience. Our
            dedicated team ensures every order is handled with care.
          </p>

          <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            📞 Contact Us
          </h2>
          <p style={{ fontSize: "1rem", color: "#555" }}>
            Have questions or feedback? We’d love to hear from you!
            <br />
            <b>Email:</b> support@zamzamgeneralstore.com
            <br />
            <b>Phone:</b> +91 xxxxx xxxxx
            <br />
            <b>Address:</b> Zam-zam General Store Pvt. Ltd., Kolkata, India
          </p>
        </div>
      </div>
     
    </>
  );
}
