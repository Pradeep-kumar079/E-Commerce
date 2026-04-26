import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./Account.css";
import { useNavigate } from "react-router-dom";

const BASE_IMAGE_URL = "http://localhost:5000";

/* ── Sidebar icons ── */
const IcoUser    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoMap     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IcoCcard   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const IcoBox     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>;
const IcoTruck   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IcoHelp    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcoFaq     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const IcoCart    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
const IcoStar    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoBell    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const IcoLogout  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>;

const Account = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [user, setUser] = useState({ username:"", gender:"", email:"", phone:"", address:"", city:"", state:"", zip:"" });
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res  = await fetch("http://localhost:5000/api/user/", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) return;
        const u = data.user || data;
        setUser({ username:u.username||"", email:u.email||"", phone:u.phone||"", address:u.address||"", city:u.city||"", state:u.state||"", zip:u.zip||"", gender:u.gender||"" });
      } catch (err) { console.error(err); }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      const res  = await fetch("http://localhost:5000/api/user/", { method:"PUT", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` }, body:JSON.stringify(user) });
      const data = await res.json();
      if (!res.ok) { alert("Failed to update profile"); return; }
      alert("Profile updated successfully!");
      setUser(data.user || data);
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      const response = await fetch("http://localhost:5000/api/user/orders", { headers: { Authorization:`Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) return;
      setOrders(data.orders || []);
    } catch (err) { console.error(err); }
  };

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      const response = await fetch("http://localhost:5000/api/cart/", { headers: { Authorization:`Bearer ${token}` } });
      const data = await response.json();
      setCartItems(data.cart && Array.isArray(data.cart.items) ? data.cart.items : []);
    } catch (err) { console.error(err); }
  };

  const getProductImage = (imgField) => {
    if (!imgField) return "";
    if (Array.isArray(imgField)) return `${BASE_IMAGE_URL}${imgField[0]}`;
    return `${BASE_IMAGE_URL}${imgField}`;
  };

  const go = (section, cb) => { setActiveSection(section); cb && cb(); };

  return (
    <>
      <Navbar />
      <div className="account-page">
        <div className="account-layout">

          {/* ── SIDEBAR ── */}
          <aside className="account-sidebar">
            <div className="sidebar-user">
              <div className="sidebar-avatar">{user.username ? user.username.charAt(0).toUpperCase() : "U"}</div>
              <div>
                <div className="sidebar-user-name">{user.username || "My Account"}</div>
                <div className="sidebar-user-sub">{user.email || "—"}</div>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-section-label">Profile</div>
              <div className="sidebar-buttons">
                <button className={activeSection==="profile"?"activeBtn":undefined} onClick={()=>go("profile")}><IcoUser/>Profile Information</button>
                <button className={activeSection==="address"?"activeBtn":undefined} onClick={()=>go("address")}><IcoMap/>Manage Address</button>
                <button className={activeSection==="payment"?"activeBtn":undefined} onClick={()=>go("payment")}><IcoCcard/>Payment Methods</button>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-section-label">Orders</div>
              <div className="sidebar-buttons">
                <button className={activeSection==="orders"?"activeBtn":undefined} onClick={()=>go("orders",fetchOrders)}><IcoBox/>Order History</button>
                <button className={activeSection==="track"?"activeBtn":undefined} onClick={()=>go("track")}><IcoTruck/>Track Order</button>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-section-label">Support</div>
              <div className="sidebar-buttons">
                <button className={activeSection==="support"?"activeBtn":undefined} onClick={()=>go("support")}><IcoHelp/>Contact Support</button>
                <button className={activeSection==="faq"?"activeBtn":undefined} onClick={()=>go("faq")}><IcoFaq/>FAQ</button>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-section-label">My Stuff</div>
              <div className="sidebar-buttons">
                <button className={activeSection==="cart"?"activeBtn":undefined} onClick={()=>go("cart",fetchCartItems)}><IcoCart/>Cart Items</button>
                <button className={activeSection==="reviews"?"activeBtn":undefined} onClick={()=>go("reviews")}><IcoStar/>Reviews &amp; Ratings</button>
                <button className={activeSection==="notifications"?"activeBtn":undefined} onClick={()=>go("notifications")}><IcoBell/>Notifications</button>
              </div>
            </div>

            <div className="logout-section">
              <button className="logout-btn" onClick={()=>{ localStorage.removeItem("token"); navigate("/login"); }}>
                <IcoLogout /> Logout
              </button>
            </div>
          </aside>

          {/* ── CONTENT ── */}
          <main className="account-content">

            {activeSection === "profile" && (
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-header-icon"><IcoUser/></div>
                  <h2>Profile Information</h2>
                </div>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Username</label>
                    <input type="text" name="username" value={user.username} onChange={handleChange} placeholder="Your name"/>
                  </div>
                  <div className="form-field">
                    <label>Gender</label>
                    <select name="gender" value={user.gender} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Email</label>
                    <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="you@example.com"/>
                  </div>
                  <div className="form-field">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" value={user.phone} onChange={handleChange} placeholder="+91 00000 00000"/>
                  </div>
                </div>
                <button className="saveBtn" onClick={handleSave}>Save Changes</button>
              </div>
            )}

            {activeSection === "address" && (
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-header-icon"><IcoMap/></div>
                  <h2>Manage Address</h2>
                </div>
                <div className="form-grid">
                  <div className="form-field full">
                    <label>Street Address</label>
                    <input type="text" name="address" value={user.address} onChange={handleChange} placeholder="123 Main St"/>
                  </div>
                  <div className="form-field">
                    <label>City</label>
                    <input type="text" name="city" value={user.city} onChange={handleChange} placeholder="City"/>
                  </div>
                  <div className="form-field">
                    <label>State</label>
                    <input type="text" name="state" value={user.state} onChange={handleChange} placeholder="State"/>
                  </div>
                  <div className="form-field">
                    <label>Zip Code</label>
                    <input type="text" name="zip" value={user.zip} onChange={handleChange} placeholder="560001"/>
                  </div>
                </div>
                <button className="saveBtn" onClick={handleSave}>Save Address</button>
              </div>
            )}

            {activeSection === "payment" && (
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-header-icon"><IcoCcard/></div>
                  <h2>Payment Methods</h2>
                </div>
                <p>Saved cards, UPI, and wallets will appear here.</p>
              </div>
            )}

            {activeSection === "orders" && (
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-header-icon"><IcoBox/></div>
                  <h2>Order History</h2>
                </div>
                {orders.length === 0 ? (
                  <p>No orders found.</p>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order._id} className="order-card">
                        <div className="order-header">
                          <h3>Order ID: {order._id}</h3>
                          <span className="order-status">{order.orderStatus || order.paymentStatus}</span>
                        </div>
                        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                        <p><strong>Payment:</strong> {order.paymentMethod || "N/A"} · {order.paymentStatus || "N/A"}</p>
                        <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <h4>Products</h4>
                        {order.orderItems && order.orderItems.length > 0 ? order.orderItems.map((item, i) => (
                          <div key={i} className="product-item">
                            {item.product ? (
                              <>
                                <img src={getProductImage(item.product.images)} alt={item.product.name}/>
                                <div className="product-details">
                                  <p className="product-name">{item.product.name}</p>
                                  <p>Qty: {item.quantity} · ₹{item.price}</p>
                                </div>
                              </>
                            ) : <p>Product details not available</p>}
                          </div>
                        )) : <p>No products in this order.</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "track" && (
              <div className="panel">
                <div className="panel-header"><div className="panel-header-icon"><IcoTruck/></div><h2>Track Order</h2></div>
                <p>Enter your order ID on the tracking page to see live status.</p>
              </div>
            )}

            {activeSection === "support" && (
              <div className="panel">
                <div className="panel-header"><div className="panel-header-icon"><IcoHelp/></div><h2>Customer Support</h2></div>
                <p>Mail us at <strong style={{color:"#e89060"}}>support@example.com</strong> or call <strong style={{color:"#e89060"}}>1800-123-456</strong>.</p>
              </div>
            )}

            {activeSection === "faq" && (
              <div className="panel">
                <div className="panel-header"><div className="panel-header-icon"><IcoFaq/></div><h2>FAQ</h2></div>
                <p>Frequently asked questions will appear here.</p>
              </div>
            )}

            {activeSection === "cart" && (
              <div className="panel">
                <div className="panel-header"><div className="panel-header-icon"><IcoCart/></div><h2>Cart Items</h2></div>
                {cartItems.length > 0 ? (
                  <ul className="cart-list">
                    {cartItems.map((item) => (
                      <li key={item._id} className="cart-item">
                        {item.productId ? (
                          <>
                            <img src={getProductImage(item.productId.images)} alt={item.productId.name}/>
                            <div className="cart-item-info">
                              <p className="product-name">{item.productId.name}</p>
                              <p>₹{item.productId.price} × {item.quantity}</p>
                            </div>
                          </>
                        ) : <span style={{color:"#6b5f52"}}>Product details not available</span>}
                      </li>
                    ))}
                  </ul>
                ) : <p>No items in cart.</p>}
              </div>
            )}

            {activeSection === "reviews" && (
              <div className="panel">
                <div className="panel-header"><div className="panel-header-icon"><IcoStar/></div><h2>Reviews &amp; Ratings</h2></div>
                <p>You haven't reviewed any product yet.</p>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="panel">
                <div className="panel-header"><div className="panel-header-icon"><IcoBell/></div><h2>Notifications</h2></div>
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