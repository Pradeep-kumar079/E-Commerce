import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Sports.css';

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const Sports = () => {
  const BASE_IMAGE_URL = "http://localhost:5000";
  const [sportsProducts, setSportsProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_IMAGE_URL}/api/home/all-products`)
      .then((res) => {
        const sportsItems = res.data.filter((p) => p.category === "sports");
        setSportsProducts(sportsItems);
      })
      .catch((err) => console.error("Error fetching sports:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="sports-container">

      {/* ── Header ── */}
      <div className="sports-header">
        <div className="sports-header-left">
          <span className="sports-eyebrow">Shop by Category</span>
          <h2 className="sports-title">Sports & Fitness</h2>
          <p className="sports-subtitle">Gear up for every game, every goal, every great moment.</p>
        </div>
        <Link to="/products?category=sports" className="sports-view-all">
          View All <IconArrow />
        </Link>
      </div>

      <div className="sports-divider" />

      {/* ── Content ── */}
      {loading ? (
        <div className="sports-loading">Loading sports products…</div>
      ) : sportsProducts.length === 0 ? (
        <div className="sports-empty">No sports products available right now.</div>
      ) : (
        <div className="sports-list">
          {sportsProducts.map((item) => (
            <div className="card-container" key={item._id}>
              <ProductCard product={item} BASE_IMAGE_URL={BASE_IMAGE_URL} />
            </div>
          ))}
        </div>
      )}

    </section>
  );
};

export default Sports;