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
            About <span style={{ color: "#c49b63" }}>Asrar Perfume</span>
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.8",
              maxWidth: "800px",
              margin: "0 auto 40px",
            }}
          >
            Welcome to <b>Asrar Perfume</b> – your destination for luxurious,
            long-lasting, and authentic fragrances. Founded with a passion for
            perfection, we believe that perfume is not just a scent – it’s a
            statement of who you are. Our mission is to bring you high-quality,
            handpicked Arabic and Western fragrances at affordable prices.
          </p>

          <img
            src="https://res.cloudinary.com/defte4omf/image/upload/v1759056266/Gemini_Generated_Image_fhwbnnfhwbnnfhwb_unvamv.png"
            alt="Asrar Perfume Collection"
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
            Started in 2025, Asrar Perfume was born from a love of traditional
            Arabian perfumery and modern fragrance artistry. Each perfume we
            craft or source goes through careful testing to ensure long-lasting
            aroma, purity, and elegance. We are proud to serve thousands of
            happy customers across India and beyond.
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
            We promise 100% authentic and premium-quality perfumes, fast
            delivery, and a fragrance experience you’ll fall in love with. Our
            dedicated team ensures every bottle you receive carries the essence
            of excellence.
          </p>

          <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            📞 Contact Us
          </h2>
          <p style={{ fontSize: "1rem", color: "#555" }}>
            Have questions or feedback? We’d love to hear from you!
            <br />
            <b>Email:</b> support@asrarperfume.com
            <br />
            <b>Phone:</b> +91 xxxxx xxxxx
            <br />
            <b>Address:</b> Asrar Perfume Pvt. Ltd., Kolkata, India
          </p>
        </div>
      </div>
     
    </>
  );
}
