import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./Electronic.css";

const Electronics = () => {
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_IMAGE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchElectronics = async () => {
      try {
        const res = await axios.get(`${BASE_IMAGE_URL}/api/home/all-products`);
        const electronicItems = res.data.filter(
          (p) => p.category === "electronics"
        );
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
        <h2>Electronics</h2>
        <p>Explore our collection of the latest and trending electronics.</p>
      </div>

      {loading ? (
        <div className="electronics-loading">Loading electronics...</div>
      ) : electronics.length === 0 ? (
        <div className="electronics-empty">
          No electronic products available right now.
        </div>
      ) : (
        <div className="electronics-list">
          {electronics.map((item) => (
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

export default Electronics;
