import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import "./Electronic.css";

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const Electronics = () => {
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_IMAGE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchElectronics = async () => {
      try {
        const res = await axios.get(`${BASE_IMAGE_URL}/api/home/all-products`);
        const electronicItems = res.data.filter((p) => p.category === "electronics");
        setElectronics(electronicItems);
      } catch (err) {
        console.error("Error fetching electronics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchElectronics();
  }, []);

  return (
    <section className="electronics-container">
      <div className="electronics-header">
        <div className="electronics-header-left">
          <span className="electronics-eyebrow">Shop by Category</span>
          <h2>Electronics</h2>
          <p>Explore the latest and trending electronics.</p>
        </div>
        <Link to="/products?category=electronics" className="electronics-view-all">
          View All <IconArrow />
        </Link>
      </div>

      <div className="electronics-divider" />

      {loading ? (
        <div className="electronics-loading">Loading electronics…</div>
      ) : electronics.length === 0 ? (
        <div className="electronics-empty">No electronic products available right now.</div>
      ) : (
        <div className="electronics-list">
          {electronics.map((item) => (
            <div className="card-container" key={item._id}>
              <ProductCard product={item} BASE_IMAGE_URL={BASE_IMAGE_URL} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Electronics;