import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PaymentSuccess.css";

export default function PaymentSuccess() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const orderId = query.get("order_id");

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        setErrorMsg("");

        const res = await fetch(
          `http://localhost:5000/api/order/verify-payment?order_id=${orderId}`
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to load order details");
        }

        setOrderDetails(data);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="payment-page">
        <div className="payment-card error">
          <h1>No order details found in URL ❌</h1>
          <button onClick={() => (window.location.href = "/home")}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const order = orderDetails?.order;
  const status = orderDetails?.order_status;
  const paymentMethod = orderDetails?.payment_method;
  const orderAmount = orderDetails?.order_amount;
  const orderCurrency = orderDetails?.order_currency;

  const getStatusClass = () => {
    if (status === "PAID") return "status-badge success";
    if (status === "PENDING") return "status-badge pending";
    return "status-badge failed";
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <div className="payment-header">
          <div>
            <h1>Payment Status</h1>
            <p className="subtext">
              Thank you for your purchase. Here are your order details.
            </p>
          </div>
          <div className={getStatusClass()}>{status || "UNKNOWN"}</div>
        </div>

        {loading && <p>Loading payment details...</p>}
        {errorMsg && <p className="error-text">⚠ {errorMsg}</p>}

        {!loading && !errorMsg && (
          <>
            {/* Order Summary */}
            <section className="summary-section">
              <h2>Order Summary</h2>
              <div className="summary-grid">
                <div>
                  <span className="label">Order ID</span>
                  <span className="value">{orderDetails?.order_id}</span>
                </div>
                <div>
                  <span className="label">Amount</span>
                  <span className="value">
                    {orderAmount} {orderCurrency}
                  </span>
                </div>
                <div>
                  <span className="label">Payment Method</span>
                  <span className="value">
                    {paymentMethod?.payment_mode || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="label">Payment Status</span>
                  <span className="value">{status}</span>
                </div>
              </div>
            </section>

            {/* Product Details */}
            {order && order.orderItems && order.orderItems.length > 0 && (
              <section className="products-section">
                <h2>Items in Your Order</h2>
                <div className="table-wrapper">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item, idx) => {
                        const product = item.product || {};
                        const name = product.name || "Product";
                        const category = product.category || "-";
                        const price = item.price ?? product.price ?? 0;
                        const qty = item.quantity || 1;
                        const subtotal = price * qty;

                        return (
                          <tr key={idx}>
                            <td>{name}</td>
                            <td>{category}</td>
                            <td>
                              {price} {orderCurrency}
                            </td>
                            <td>{qty}</td>
                            <td>
                              {subtotal} {orderCurrency}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="total-row">
                  <span>Total Paid:</span>
                  <span>
                    {orderAmount} {orderCurrency}
                  </span>
                </div>
              </section>
            )}

            {/* Actions */}
            <div className="actions">
              <button
                className="primary-btn"
                onClick={() => (window.location.href = "/home")}
              >
                Continue Shopping
              </button>
              <button
                className="secondary-btn"
                onClick={() => (window.location.href = "/orders")}
              >
                View My Orders
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
