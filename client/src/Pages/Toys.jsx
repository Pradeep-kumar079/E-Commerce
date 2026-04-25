import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "./Toys.css";

const Toys = () => {
  const BASE_IMAGE_URL = "http://localhost:5000";
  const [toys, setToys] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_IMAGE_URL}/api/home/all-products`)
      .then((res) => {
        const toyItems = res.data.filter((p) => p.category === "toys");
        setToys(toyItems);
      })
      .catch((err) => console.error("Error fetching toys:", err));
  }, []);

  return (
    <div className="toys-container">
      <h2 className="toys-title">Toys Collection</h2>

      <div className="toys-list">
        {toys.map((item) => (
          <ProductCard
            key={item._id}
            product={item}
            BASE_IMAGE_URL={BASE_IMAGE_URL}
          />
        ))}
      </div>
    </div>
  );
};

export default Toys;
