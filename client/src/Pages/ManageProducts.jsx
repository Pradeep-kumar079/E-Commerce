import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './ManageProducts.css';

const ManageProducts = () => {
  const [products, setProducts] = useState({});
  const [filteredProducts, setFilteredProducts] = useState({});
  const [loading, setLoading] = useState(true);

  const [searchCategory, setSearchCategory] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchName, setSearchName] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/allproducts");
      const grouped = response.data.reduce((acc, product) => {
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
      }, {});
      setProducts(grouped);
      setFilteredProducts(grouped);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    const filtered = Object.keys(products).reduce((acc, category) => {
      const matched = products[category].filter(p =>
        p.category.toLowerCase().includes(searchCategory.toLowerCase()) &&
        p.type.toLowerCase().includes(searchType.toLowerCase()) &&
        p.name.toLowerCase().includes(searchName.toLowerCase())
      );
      if (matched.length > 0) acc[category] = matched;
      return acc;
    }, {});
    setFilteredProducts(filtered);
  }, [searchCategory, searchType, searchName, products]);

  if (loading) return <p className="state-loading">Loading products...</p>;

  return (
    <div className="manage-products-page">
      <h2>Manage Products</h2>

      <div className="search-bar">
        <input type="text" placeholder="Search by Category" value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} />
        <input type="text" placeholder="Search by Type"     value={searchType}     onChange={(e) => setSearchType(e.target.value)} />
        <input type="text" placeholder="Search by Name"     value={searchName}     onChange={(e) => setSearchName(e.target.value)} />
      </div>

      {Object.keys(filteredProducts).length === 0 ? (
        <p>No products found.</p>
      ) : (
        Object.keys(filteredProducts).map((category) => (
          <div key={category} className="category-group">
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <div className="table-scroll">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Description</th>
                    <th>Attributes</th>
                    <th>Images</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts[category].map((product) => (
                    <tr key={product._id}>
                      <td>{product.category}</td>
                      <td>{product.type}</td>
                      <td>{product.name}</td>
                      <td>₹{product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.description}</td>
                      <td>
                        {product.attributes && (
                          <div className="attr-list">
                            {Object.entries(product.attributes).map(([key, value]) => (
                              <span key={key}><strong>{key}:</strong> {value}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>
                        {product.images && product.images.map((img, idx) => (
                          <img key={idx} src={`http://localhost:5000${img}`} alt={product.name} />
                        ))}
                      </td>
                      <td>
                        <Link to={`/admin/modify-product/${product._id}`} className="btn-edit">Edit</Link>
                        <Link to={`/admin/delete-product/${product._id}`} className="btn-delete">Delete</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageProducts;