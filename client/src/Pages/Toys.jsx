import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "./Toys.css";

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const Toys = () => {
  const BASE_IMAGE_URL = "https://e-commerce-backend-mwxg.onrender.com";
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_IMAGE_URL}/api/home/all-products`)
      .then((res) => {
        const toyItems = res.data.filter((p) => p.category === "toys");
        setToys(toyItems);
      })
      .catch((err) => console.error("Error fetching toys:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="toys-container">

      {/* ── Header ── */}
      <div className="toys-header">
        <div className="toys-header-left">
          <span className="toys-eyebrow">Shop by Category</span>
          <h2 className="toys-title">Toys Collection</h2>
          <p className="toys-subtitle">Fun & educational toys for every age group.</p>
        </div>
        <Link to="/products?category=toys" className="toys-view-all">
          View All <IconArrow />
        </Link>
      </div>

      <div className="toys-divider" />

      {/* ── Content ── */}
      {loading ? (
        <div className="toys-loading">Loading toys…</div>
      ) : toys.length === 0 ? (
        <div className="toys-empty">No toy products available right now.</div>
      ) : (
        <div className="toys-list">
          {toys.map((item) => (
            <div className="card-container" key={item._id}>
              <ProductCard product={item} BASE_IMAGE_URL={BASE_IMAGE_URL} />
            </div>
          ))}
        </div>
      )}

    </section>
  );
};

export default Toys;