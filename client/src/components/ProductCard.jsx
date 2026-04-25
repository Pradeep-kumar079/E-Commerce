import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import "./ProductCard.css";
import { Link } from "react-router-dom";

const ProductCard = ({ product, BASE_IMAGE_URL = "http://localhost:5000" }) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = (e) => {
    e.preventDefault(); // prevent navigation from Link
    setLiked((prev) => !prev);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault(); // prevent Link navigation
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/cart/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          attributes: {},
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Product added to cart!");
        console.log("Updated Cart:", data.cart);
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("⚠️ Error adding product to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-container">
      <Link to={`/product/${product._id}`} className="product-link">
        <article className="product-card">
          <div className="product-image-wrapper">
            <img
              src={`${BASE_IMAGE_URL}${product.images?.[0] || ""}`}
              alt={product.name}
              className="product-img"
            />
            {product.tag && <span className="product-badge">{product.tag}</span>}
          </div>

          <div className="product-content">
            <h3 className="product-title">{product.name}</h3>

            <div className="product-price-row">
              <span className="product-price">₹{product.price}</span>
              {product.mrp && (
                <span className="product-mrp">₹{product.mrp}</span>
              )}
            </div>

            <p className="product-desc">{product.description}</p>
          </div>

          <div className="product-footer">
            <button
              type="button"
              className={`icon-button ${liked ? "liked" : ""}`}
              onClick={handleLike}
            >
              <FaHeart />
            </button>

            <button
              type="button"
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </article>
      </Link>
    </div>
  );
};

export default ProductCard;
