import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetails.css";
import Navbar from "../components/Navbar";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [user, setUser] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const BASE_IMAGE_URL = "http://localhost:5000";

  // Fetch single product + related products
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/home/all-products/${id}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.status}`);
        }
        const data = await res.json();
        setProduct(data);

        // Fetch related products by category
        if (data.category) {
          try {
            const relatedRes = await fetch(
              `http://localhost:5000/api/home/products?category=${data.category}`
            );
            if (!relatedRes.ok) {
              throw new Error(
                `Failed to fetch related products: ${relatedRes.status}`
              );
            }
            const related = await relatedRes.json();

            const filtered = related.filter((rp) => rp._id !== data._id);
            setRelatedProducts(filtered);
          } catch (err) {
            console.error("Failed to fetch related products:", err);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found in localStorage");
          return;
        }

        const res = await fetch("http://localhost:5000/api/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("User API response:", data);

        // Handle both { user: {...} } and plain user object
        setUser(data.user || data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleBuy = async () => {
    if (!user) {
      alert("Please log in to continue.");
      return;
    }

    if (!product) {
      alert("Product not loaded yet. Please wait.");
      return;
    }

    setLoadingPayment(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No auth token found. Please log in again.");
      }

      console.log("User in handleBuy:", user);
      console.log("Product in handleBuy:", product);

      const res = await fetch("http://localhost:5000/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: product.price,
          customer: {
            customer_id: user._id,
            customer_name: user.username,
            customer_email: user.email,
            customer_phone: user.phone,
          },
          orderItems: [
            {
              product: product._id,
              quantity: 1,
              price: product.price,
            },
          ],
        }),
      });

      const raw = await res.text();
      console.log("Order API raw response:", raw);

      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg =
          data?.message ||
          data?.error?.message ||
          data?.error?.description ||
          `Error ${res.status}`;
        throw new Error(msg);
      }

      const { paymentSessionId } = data || {};
      if (!paymentSessionId) {
        throw new Error("Payment session ID missing from response.");
      }

      // Load Cashfree SDK
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.onload = () => {
        if (!window.Cashfree) {
          console.error("Cashfree SDK not available on window.");
          alert("Payment SDK failed to load. Please try again.");
          return;
        }
        const cashfree = window.Cashfree({ mode: "sandbox" });
        cashfree.checkout({ paymentSessionId, redirectTarget: "_self" });
      };
      script.onerror = () => {
        console.error("Failed to load Cashfree SDK script.");
        alert("Failed to load payment SDK. Please try again.");
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error("Error initiating payment", err);
      alert(`Payment initialization failed: ${err.message}`);
    } finally {
      setLoadingPayment(false);
    }
  };

  if (!product) return <div>Loading...</div>;

  // Normalize images safely
  let images = [];
  if (Array.isArray(product.images)) {
    images = product.images;
  } else if (typeof product.images === "string") {
    images = product.images.split(",");
  }

  const mainImage =
    images.length > 0 ? `${BASE_IMAGE_URL}${images[currentIndex].trim()}` : "";

  return (
    <>
      <Navbar />
      <div className="single-product">
        {/* LEFT - IMAGES & RELATED */}
        <div className="product-left-container">
          <div className="gallery">
            {mainImage ? (
              <img
                src={mainImage}
                alt={`${product.name}-${currentIndex}`}
                className="main-image"
              />
            ) : (
              <div className="main-image placeholder">No image available</div>
            )}

            <div className="thumbnails">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={`${BASE_IMAGE_URL}${img.trim()}`}
                  alt={`${product.name}-thumb-${index}`}
                  className={index === currentIndex ? "thumb active" : "thumb"}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Related Products */}
          <div className="related-products">
            <h4>Related Products:</h4>
            <div className="related-grid">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((relatedProduct) => {
                  let relatedImages = [];
                  if (Array.isArray(relatedProduct.images)) {
                    relatedImages = relatedProduct.images;
                  } else if (typeof relatedProduct.images === "string") {
                    relatedImages = relatedProduct.images.split(",");
                  }
                  const firstImage =
                    relatedImages.length > 0
                      ? `${BASE_IMAGE_URL}${relatedImages[0].trim()}`
                      : "";

                  return (
                    <Link
                      key={relatedProduct._id}
                      to={`/product/${relatedProduct._id}`}
                      className="related-card"
                    >
                      {firstImage ? (
                        <img src={firstImage} alt={relatedProduct.name} />
                      ) : (
                        <div className="related-image-placeholder">
                          No image
                        </div>
                      )}
                      <div className="related-info">
                        <h5>{relatedProduct.name}</h5>
                        <p>₹{relatedProduct.price}</p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p>No related products found.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT - DETAILS & REVIEWS */}
        <div className="product-container">
          <div className="product-info">
            <h2>{product.name}</h2>
            <p>
              <strong>Price:</strong> ₹{product.price}
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Type:</strong> {product.type}
            </p>
            <p>
              <strong>Stock:</strong> {product.stock}
            </p>
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>
            <div className="descriptions">
              <p>
                <strong>Description:</strong> {product.description}
              </p>
            </div>

            {product.attributes && (
              <div className="specifications">
                <h4>Specifications:</h4>
                <ul>
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={handleBuy} disabled={loadingPayment}>
              {loadingPayment ? "Processing..." : "Buy"}
            </button>
          </div>

          <div className="reviews">
            <h4>Customer Reviews:</h4>
            <ul>
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, index) => (
                  <li key={index}>
                    <strong>{review.username}</strong>: {review.comment} (Rating:{" "}
                    {review.rating})
                  </li>
                ))
              ) : (
                <li>No reviews yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
