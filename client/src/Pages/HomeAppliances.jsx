import axios from "axios";
import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import "./HomeAppliances.css";

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
      <div className="home-appliances-header">
        <h2>Home Appliances</h2>
        <p>Find essential appliances to make your home smarter and more comfortable.</p>
      </div>

      {loading ? (
        <div className="home-appliances-loading">Loading home appliances...</div>
      ) : homeAppliances.length === 0 ? (
        <div className="home-appliances-empty">
          No home appliance products available right now.
        </div>
      ) : (
        <div className="home-appliances-list">
          {homeAppliances.map((item) => (
            <ProductCard
              key={item._id}
              product={item}
              BASE_IMAGE_URL={BASE_IMAGE_URL}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HomeAppliances;
