// ===============================
// FRONTEND (AdminEditProduct.jsx)
// Added: Edit Existing Images + Upload New Images
// ===============================

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";

const AdminEditProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    type: "",
    stock: 0,
    attributes: {},
    images: [],
  });

  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const productId = window.location.pathname.split("/").pop();

  const fetchProduct = async (id) => {
    try {
      const response = await axios.get(
        `https://e-commerce-backend-mwxg.onrender.com/api/admin/product/${id}`
      );

      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct(productId);
  }, [productId]);

  // Remove existing image
  const removeOldImage = (index) => {
    const updatedImages = [...product.images];
    updatedImages.splice(index, 1);

    setProduct({
      ...product,
      images: updatedImages,
    });
  };

  // New uploaded images
  const handleNewImages = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("type", product.type);
      formData.append("stock", product.stock);
      formData.append(
        "attributes",
        JSON.stringify(product.attributes)
      );

      // old images
      formData.append(
        "existingImages",
        JSON.stringify(product.images)
      );

      // new uploaded images
      newImages.forEach((img) => {
        formData.append("images", img);
      });

      await axios.put(
        `https://e-commerce-backend-mwxg.onrender.com/api/admin/modify-product/${product._id}`,
        formData
      );

      alert("Product updated successfully");
      navigate("/manage-products");
    } catch (error) {
      console.log(error);
      alert("Failed to update product");
    }
  };

  if (loading) return <p>Loading product...</p>;

  return (
    <div className="admin-page">
      <div className="admin-card">
        <h2>Edit Product</h2>

        <form className="edit-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={product.name}
            onChange={(e) =>
              setProduct({
                ...product,
                name: e.target.value,
              })
            }
            placeholder="Product Name"
          />

          <input
            type="number"
            value={product.price}
            onChange={(e) =>
              setProduct({
                ...product,
                price: e.target.value,
              })
            }
            placeholder="Price"
          />

          <textarea
            value={product.description}
            onChange={(e) =>
              setProduct({
                ...product,
                description: e.target.value,
              })
            }
            placeholder="Description"
          />

          {/* Existing Images */}
          <h3>Existing Images</h3>

          <div className="image-preview">
            {product.images?.map((img, index) => (
              <div key={index} className="single-image">
                <img
                  src={`https://e-commerce-backend-mwxg.onrender.com${img}`}
                  alt="product"
                  width="100"
                />

                <button
                  type="button"
                  onClick={() => removeOldImage(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Upload New Images */}
          <h3>Upload New Images</h3>

          <input
            type="file"
            multiple
            onChange={handleNewImages}
          />

          <button type="submit">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProduct;