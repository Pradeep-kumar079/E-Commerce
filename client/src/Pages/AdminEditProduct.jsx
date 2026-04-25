import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminEditProduct = () => {
  const [product, setProduct] = useState({ name: '', price: 0, description: '', category: '', type: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const productId = window.location.pathname.split("/").pop();

  // Fetch product details
  const fetchProduct = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/product/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct(productId);
  }, [productId]);

  // Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/modify-product/${product._id}`, product);
      alert("Product updated successfully");
      navigate("/manage-products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  if (loading) return <p>Loading product...</p>;

  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
          />
        </div>

         <div>
          <label>Type:</label>
          <input
            type="text"
            value={product.type}
            onChange={(e) => setProduct({ ...product, type: e.target.value })}
          />
         </div>

        <div>
          <label>Name:</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
        </div>

        <div>
          <label>Stock :</label>
          <input
            type="number"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: e.target.value })}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
        </div>

        <div>
          <label>Attributes:</label>
          <textarea
            value={JSON.stringify(product.attributes, null, 2)}
            onChange={(e) => setProduct({ ...product, attributes: JSON.parse(e.target.value) })}
          />
        </div>

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default AdminEditProduct;
