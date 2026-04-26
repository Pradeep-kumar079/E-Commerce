import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "./HomeAppliances.css";

/* ── Arrow icon ── */
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const HomeAppliances = () => {
  const [homeAppliances, setHomeAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_IMAGE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchHomeAppliances = async () => {
      try {
        const res = await axios.get(`${BASE_IMAGE_URL}/api/home/all-products`);
        const homeApplianceItems = res.data.filter(
          (p) => p.category === "home-appliances"
        );
        setHomeAppliances(homeApplianceItems);
      } catch (err) {
        console.error("Error fetching home appliances:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeAppliances();
  }, []);

  return (
    <section className="home-appliances-container">

      {/* ── Header ── */}
      <div className="home-appliances-header">
        <div className="home-appliances-header-left">
          <span className="home-appliances-eyebrow">Shop by Category</span>
          <h2>Home Appliances</h2>
          <p>Essential appliances to make your home smarter and more comfortable.</p>
        </div>

        <Link to="/products?category=home-appliances" className="home-appliances-view-all">
          View All <IconArrow />
        </Link>
      </div>

      <div className="home-appliances-divider" />

      {/* ── Content ── */}
      {loading ? (
        <div className="home-appliances-loading">Loading home appliances…</div>
      ) : homeAppliances.length === 0 ? (
        <div className="home-appliances-empty">
          No home appliance products available right now.
        </div>
      ) : (
        <div className="home-appliances-list">
          {homeAppliances.map((item) => (
            <div className="card-container" key={item._id}>
              <ProductCard
                product={item}
                BASE_IMAGE_URL={BASE_IMAGE_URL}
              />
            </div>
          ))}
        </div>
      )}

    </section>
  );
};

export default HomeAppliances;