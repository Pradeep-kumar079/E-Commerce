import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './AdminPage.css';

const AdminDeleteProduct = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const productId = window.location.pathname.split("/").pop();

  const fetchProduct = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/product/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch product");
      setLoading(false);
    }
  };

  useEffect(() => { fetchProduct(productId); }, [productId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete-product/${id}`);
      alert("Product deleted successfully!");
      navigate("/admin/manage-products");
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  if (loading) return <p className="state-loading">Loading product...</p>;
  if (error)   return <p className="state-error">{error}</p>;

  return (
    <div className="admin-page">
      <div className="admin-card">
        <h2>Delete Product</h2>
        {product && (
          <>
            <p className="delete-warning">Are you sure you want to permanently delete the following product? This action cannot be undone.</p>
            <div className="delete-product-info">
              <h3>{product.name}</h3>
              <p><strong>Type:</strong> {product.type}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Price:</strong> ₹{product.price}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
            </div>
            <button className="btn-confirm-delete" onClick={() => handleDelete(product._id)}>
              Confirm Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDeleteProduct;