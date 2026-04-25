import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './ManageProducts.css'; 

const ManageProducts = () => {
  const [products, setProducts] = useState({});
  const [filteredProducts, setFilteredProducts] = useState({});
  const [loading, setLoading] = useState(true);

  // Separate search states
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
      setFilteredProducts(grouped); // initialize filtered
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter based on category, type, and name
  useEffect(() => {
    const filtered = Object.keys(products).reduce((acc, category) => {
      const matchedProducts = products[category].filter(product => 
        product.category.toLowerCase().includes(searchCategory.toLowerCase()) &&
        product.type.toLowerCase().includes(searchType.toLowerCase()) &&
        product.name.toLowerCase().includes(searchName.toLowerCase())
      );
      if (matchedProducts.length > 0) acc[category] = matchedProducts;
      return acc;
    }, {});
    setFilteredProducts(filtered);
  }, [searchCategory, searchType, searchName, products]);

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h2>Manage Products</h2>

      {/* Search Inputs */}
      <div className="search-bar" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search by Category"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", flex: 1 }}
        />
        <input
          type="text"
          placeholder="Search by Type"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", flex: 1 }}
        />
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", flex: 1 }}
        />
      </div>

      {Object.keys(filteredProducts).length === 0 ? (
        <p>No products found.</p>
      ) : (
        Object.keys(filteredProducts).map((category) => (
          <div key={category} style={{ marginBottom: "2rem" }}>
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <table border="1" cellPadding="10" cellSpacing="0">
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
                    <td>{product.price}</td>
                    <td>{product.stock}</td>
                    <td>{product.description}</td>
                    <td>
                      {product.attributes &&
                        Object.entries(product.attributes).map(([key, value]) => (
                          <div key={key}>{key}: {value}</div>
                        ))}
                    </td>
                    <td>
                      {product.images &&
                        product.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={`http://localhost:5000${img}`}
                            alt={product.name}
                            style={{ width: "50px", marginRight: "5px" }}
                          />
                        ))}
                    </td>
                    <td>
                      <Link to={`/admin/modify-product/${product._id}`}>
                        <button>Edit</button>
                      </Link>
                      <Link to={`/admin/delete-product/${product._id}`}>
                        <button>Delete</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageProducts;
