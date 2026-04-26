import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cart.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = 'https://e-commerce-backend-mwxg.onrender.com';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  if (path.startsWith('uploads')) return `${BACKEND_URL}/${path}`;
  return `${BACKEND_URL}/uploads/${path}`;
};

/* ── Icons ── */
const IcoTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IcoLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const IcoHelp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('User fetch failed', err.response?.data || err.message);
    }
  };

  const updateQuantity = async (productId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BACKEND_URL}/api/cart/update`,
        { productId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="cart-page-loading">
        <Navbar />
        <div className="cart-loading-text">Loading your cart…</div>
      </div>
    );
  }

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice = cart?.items?.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0) || 0;

  const handleCheckout = async () => {
    if (!user) return alert('Please log in to continue.');
    try {
      setLoadingPayment(true);
      const token = localStorage.getItem('token');
      if (!token) { alert('Please log in to continue.'); navigate('/login'); return; }

      const res = await axios.post(
        `${BACKEND_URL}/api/order/create`,
        {
          amount: totalPrice,
          orderItems: cart.items.map((item) => ({
            product: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
          })),
          customer: {
            customer_id: user._id,
            customer_name: user.username,
            customer_email: user.email,
            customer_phone: user.phone,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { paymentSessionId } = res.data;
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => {
        const cashfree = window.Cashfree({ mode: 'sandbox' });
        cashfree.checkout({ paymentSessionId, redirectTarget: '_self' });
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="cart-page">
      <Navbar />

      <main className="cart_container">
        {/* ── Cart Items ── */}
        <section className="cart_items">
          <header className="cart_items_header">
            <h2>Your Cart</h2>
            {cart && cart.items.length > 0 && (
              <span className="cart_items_count">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
            )}
          </header>

          {cart && cart.items.length > 0 ? (
            cart.items.map((item, index) => (
              <article key={index} className="cart_item">
                <div className="cart_image">
                  {item.productId?.images && item.productId.images.length > 0 ? (
                    <img src={getImageUrl(item.productId.images[0])} alt={item.productId?.name || 'Product'} />
                  ) : (
                    <div className="no_image">No Image</div>
                  )}
                </div>

                <div className="cart_info">
                  <div className="cart_info_top">
                    <h4>{item.productId?.name || 'Unknown Product'}</h4>
                    <button
                      className="remove_btn"
                      onClick={() => removeFromCart(item.productId._id)}
                      title="Remove item"
                    >
                      <IcoTrash />
                    </button>
                  </div>

                  <p className="cart_price">Unit price: <span>₹{item.productId?.price || 0}</span></p>
                  <p className="cart_total">Subtotal: <span>₹{(item.productId?.price || 0) * item.quantity}</span></p>

                  <div className="quantity_controls">
                    <button onClick={() => updateQuantity(item.productId._id, 'decrease')} disabled={item.quantity <= 1}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId._id, 'increase')}>+</button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="cart-empty-text">Your cart is empty.</p>
          )}
        </section>

        {/* ── Order Summary ── */}
        <aside className="checkout">
          <div className="checkout-eyebrow">Summary</div>
          <h3>Order Summary</h3>

          <div className="checkout_row">
            <span>Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="checkout_row">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="checkout_row">
            <span>Shipping</span>
            <span className="free-tag">Free</span>
          </div>

          <div className="checkout-divider" />

          <div className="checkout_total_row">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>

          <button
            className="checkout_btn"
            onClick={handleCheckout}
            disabled={loadingPayment || !cart || cart.items.length === 0}
          >
            {loadingPayment ? 'Processing…' : 'Proceed to Checkout'}
          </button>

          <p className="checkout_note">
            <IcoLock /> Secure payments via Cashfree
          </p>
        </aside>
      </main>

      {/* ── Help strip ── */}
      <section className="extra-details">
        <div className="extra-details-icon"><IcoHelp /></div>
        <div className="extra-details-text">
          <h4>Need Help?</h4>
          <p>Questions about your order? Contact our support team anytime.</p>
        </div>
      </section>
    </div>
  );
};

export default Cart;