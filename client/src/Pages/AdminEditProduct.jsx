import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminEditProduct = () => {
  const [product, setProduct] = useState({ name: '', price: 0, description: '', category: '', type: '', stock: 0, attributes: {} });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const productId = window.location.pathname.split("/").pop();

  const fetchProduct = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/product/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProduct(productId); }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/modify-product/${product._id}`, product);
      alert("Product updated successfully");
      navigate("/manage-products");
    } catch (error) {
      alert("Failed to update product");
    }
  };

  if (loading) return <p className="state-loading">Loading product...</p>;

  return (
    <div className="admin-page">
      <div className="admin-card">
        <h2>Edit Product</h2>
        <form className="edit-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Category</label>
            <input type="text" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Type</label>
            <input type="text" value={product.type} onChange={(e) => setProduct({ ...product, type: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input type="text" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Price (₹)</label>
            <input type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input type="number" value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Attributes (JSON)</label>
            <textarea
              value={JSON.stringify(product.attributes, null, 2)}
              onChange={(e) => {
                try { setProduct({ ...product, attributes: JSON.parse(e.target.value) }); } catch {}
              }}
              style={{ fontFamily: 'monospace', fontSize: '13px' }}
            />
          </div>

          <button type="submit" className="btn-update">Update Product</button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProduct;