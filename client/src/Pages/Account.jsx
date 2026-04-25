import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./Account.css";
import { useNavigate } from "react-router-dom";

const BASE_IMAGE_URL = "http://localhost:5000";

const Account = () => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("profile");
  const [user, setUser] = useState({
    username: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // ---------- Fetch logged-in user ----------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Error fetching user:", data);
          return;
        }

        const u = data.user || data; // handle both { user: {...} } and plain object

        setUser({
          username: u.username || "",
          email: u.email || "",
          phone: u.phone || "",
          address: u.address || "",
          city: u.city || "",
          state: u.state || "",
          zip: u.zip || "",
          gender: u.gender || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  // ---------- Form handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Not logged in!");
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:5000/api/user/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error updating user:", data);
        alert("Failed to update profile");
        return;
      }

      alert("Profile updated successfully!");
      setUser(data.user || data);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

// ---------- Orders ----------
const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user not logged in");
      navigate("/login");
      return;
    }

    const response = await fetch("http://localhost:5000/api/user/orders", { // 🔥 FIX HERE
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error fetching orders:", data);
      return;
    }

    setOrders(data.orders || []);
    console.log("Fetched orders:", data.orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
};


  // ---------- Cart ----------
  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user not logged in");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/cart/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Cart API response:", data);

      setCartItems(
        data.cart && Array.isArray(data.cart.items) ? data.cart.items : []
      );
    } catch (err) {
      console.error("Error fetching cart items:", err);
    }
  };

  // Helper: product image path
  const getProductImage = (imgField) => {
    if (!imgField) return "";
    if (Array.isArray(imgField)) {
      return `${BASE_IMAGE_URL}${imgField[0]}`;
    }
    return `${BASE_IMAGE_URL}${imgField}`;
  };

  return (
    <>
      <Navbar />

      <div className="account-page">
        <div className="account-layout">
          {/* -------- SIDEBAR -------- */}
          <aside className="account-sidebar">
            <h2 className="sidebar-title">Account</h2>

            <div className="sidebar-section">
              <h3>Profile</h3>
              <div className="sidebar-buttons">
                <button
                  className={
                    activeSection === "profile" ? "activeBtn" : undefined
                  }
                  onClick={() => setActiveSection("profile")}
                >
                  Profile Information
                </button>
                <button
                  className={
                    activeSection === "address" ? "activeBtn" : undefined
                  }
                  onClick={() => setActiveSection("address")}
                >
                  Manage Address
                </button>
                <button
                  className={
                    activeSection === "payment" ? "activeBtn" : undefined
                  }
                  onClick={() => setActiveSection("payment")}
                >
                  Payment Methods
                </button>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Orders</h3>
              <div className="sidebar-buttons">
                <button
                  className={
                    activeSection === "orders" ? "activeBtn" : undefined
                  }
                  onClick={() => {
                    setActiveSection("orders");
                    fetchOrders();
                  }}
                >
                  Order History
                </button>
                <button
                  className={
                    activeSection === "track" ? "activeBtn" : undefined
                  }
                  onClick={() => setActiveSection("track")}
                >
                  Track Order
                </button>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Support</h3>
              <div className="sidebar-buttons">
                <button
                  className={
                    activeSection === "support" ? "activeBtn" : undefined
                  }
                  onClick={() => setActiveSection("support")}
                >
                  Contact Support
                </button>
                <button
                  className={activeSection === "faq" ? "activeBtn" : undefined}
                  onClick={() => setActiveSection("faq")}
                >
                  FAQ
                </button>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>My Stuff</h3>
              <div className="sidebar-buttons">
                <button
                  className={activeSection === "cart" ? "activeBtn" : undefined}
                  onClick={() => {
                    setActiveSection("cart");
                    fetchCartItems();
                  }}
                >
                  Cart Items
                </button>
                <button
                  className={
                    activeSection === "reviews" ? "activeBtn" : undefined
                  }
                  onClick={() => setActiveSection("reviews")}
                >
                  Reviews & Ratings
                </button>
                <button
                  className={
                    activeSection === "notifications" ? "activeBtn" : undefined
                  }
                  onClick={() => setActiveSection("notifications")}
                >
                  Notifications
                </button>
              </div>
            </div>

            <div className="sidebar-section logout-section">
              <button
                className="logout-btn"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          </aside>

          {/* -------- RIGHT CONTENT -------- */}
          <main className="account-content">
            {/* Profile */}
            {activeSection === "profile" && (
              <div className="panel">
                <h2>Profile Information</h2>

                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                />

                <label>Gender</label>
                <select
                  name="gender"
                  id="gender"
                  value={user.gender}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />

                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                />

                <button className="saveBtn" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            )}

            {/* Address */}
            {activeSection === "address" && (
              <div className="panel">
                <h2>Manage Address</h2>

                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                />

                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={user.city}
                  onChange={handleChange}
                />

                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={user.state}
                  onChange={handleChange}
                />

                <label>Zip Code</label>
                <input
                  type="text"
                  name="zip"
                  value={user.zip}
                  onChange={handleChange}
                />

                <button className="saveBtn" onClick={handleSave}>
                  Save Address
                </button>
              </div>
            )}

            {/* Payment */}
            {activeSection === "payment" && (
              <div className="panel">
                <h2>Payment Methods</h2>
                <p>Saved cards, UPI, and wallets will appear here.</p>
              </div>
            )}

            {/* Orders */}
            {activeSection === "orders" && (
              <div className="panel">
                <h2>Your Orders</h2>

                {orders.length === 0 ? (
                  <p>No orders found.</p>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order._id} className="order-card">
                        <div className="order-header">
                          <h3>Order ID: {order._id}</h3>
                          <span className="order-status">
                            {order.orderStatus || order.paymentStatus}
                          </span>
                        </div>

                        <p>
                          <strong>Total:</strong> ₹{order.totalAmount}
                        </p>
                        <p>
                          <strong>Payment Method:</strong>{" "}
                          {order.paymentMethod || "N/A"}
                        </p>
                        <p>
                          <strong>Payment Status:</strong>{" "}
                          {order.paymentStatus || "N/A"}
                        </p>
                        <p>
                          <strong>Placed on:</strong>{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>

                        <h4>Products</h4>
                        {order.orderItems && order.orderItems.length > 0 ? (
                          order.orderItems.map((item, index) => (
                            <div key={index} className="product-item">
                              {item.product ? (
                                <>
                                  <img
                                    src={getProductImage(item.product.images)}
                                    alt={item.product.name}
                                  />
                                  <div className="product-details">
                                    <p className="product-name">
                                      {item.product.name}
                                    </p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ₹{item.price}</p>
                                  </div>
                                </>
                              ) : (
                                <p>Product details not available</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p>No products found in this order.</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Track */}
            {activeSection === "track" && (
              <div className="panel">
                <h2>Track Order</h2>
                <p>Enter your order ID on the tracking page to see live status.</p>
              </div>
            )}

            {/* Support */}
            {activeSection === "support" && (
              <div className="panel">
                <h2>Customer Support</h2>
                <p>
                  For any help, mail us at{" "}
                  <strong>support@example.com</strong> or call{" "}
                  <strong>1800-123-456</strong>.
                </p>
              </div>
            )}

            {/* FAQ */}
            {activeSection === "faq" && (
              <div className="panel">
                <h2>FAQ</h2>
                <p>Frequently Asked Questions will appear here.</p>
              </div>
            )}

            {/* Cart */}
            {activeSection === "cart" && (
              <div className="panel">
                <h2>Cart Items</h2>
                {cartItems.length > 0 ? (
                  <ul className="cart-list">
                    {cartItems.map((item) => (
                      <li key={item._id} className="cart-item">
                        {item.productId ? (
                          <>
                            <img
                              src={getProductImage(item.productId.images)}
                              alt={item.productId.name}
                            />
                            <div className="cart-item-info">
                              <p className="product-name">
                                {item.productId.name}
                              </p>
                              <p>
                                ₹{item.productId.price} × {item.quantity}
                              </p>
                            </div>
                          </>
                        ) : (
                          <span>Product details not available</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No items in cart.</p>
                )}
              </div>
            )}

            {/* Reviews */}
            {activeSection === "reviews" && (
              <div className="panel">
                <h2>My Reviews and Ratings</h2>
                <p>You haven't reviewed any product yet.</p>
              </div>
            )}

            {/* Notifications */}
            {activeSection === "notifications" && (
              <div className="panel">
                <h2>Notifications</h2>
                <p>No new notifications.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Account;
