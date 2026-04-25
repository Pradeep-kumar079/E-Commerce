import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./Cloth.css";

const Cloths = () => {
  const [cloths, setCloths] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_IMAGE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchCloths = async () => {
      try {
        const res = await axios.get(`${BASE_IMAGE_URL}/api/home/all-products`);
        const clothItems = res.data.filter((p) => p.category === "clothing");
        setCloths(clothItems);
      } catch (err) {
        console.error("Error fetching cloths:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCloths();
  }, []);

  return (
    <section className="cloths-section">
      <div className="cloths-header">
        <h2>Clothes</h2>
        <p>Explore our collection of fashionable and comfortable clothing.</p>
      </div>

      {loading ? (
        <div className="cloths-loading">Loading clothes...</div>
      ) : cloths.length === 0 ? (
        <div className="cloths-empty">
          No clothing products available right now.
        </div>
      ) : (
        <div className="cloths-list">
          {cloths.map((cloth) => (
            <ProductCard
              key={cloth._id}
              product={cloth}
              BASE_IMAGE_URL={BASE_IMAGE_URL}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Cloths;
