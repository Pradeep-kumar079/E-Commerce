import React, { useState } from 'react'
import { FaHeart, FaShoppingBag } from 'react-icons/fa'
import './ProductCard.css'
import { Link } from 'react-router-dom'

const ProductCard = ({ product, BASE_IMAGE_URL = 'https://e-commerce-backend-mwxg.onrender.com' }) => {
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleLike = (e) => {
    e.preventDefault()
    setLiked((prev) => !prev)
  }

  const handleAddToCart = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      const token = localStorage.getItem('token')
      const res = await fetch('https://e-commerce-backend-mwxg.onrender.com/api/cart/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          attributes: {},
        }),
      })

      const data = await res.json()
      if (res.ok) {
        alert('✅ Product added to cart!')
        console.log('Updated Cart:', data.cart)
      } else {
        alert(`❌ ${data.message}`)
      }
    } catch (err) {
      console.error('Error adding to cart:', err)
      alert('⚠️ Error adding product to cart')
    } finally {
      setLoading(false)
    }
  }

  const discountPercentage = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0

  return (
    <div className="pc__container">
      <Link to={`/product/${product._id}`} className="pc__link">
        <article className="pc__card">
          {/* Image Section */}
          <div className="pc__image-wrapper">
            <div className="pc__image-skeleton" style={{ opacity: imageLoaded ? 0 : 1 }} />
            <img
              src={`${BASE_IMAGE_URL}${product.images?.[0] || ''}`}
              alt={product.name}
              className="pc__img"
              onLoad={() => setImageLoaded(true)}
            />

            {/* Badge */}
            {product.tag && (
              <span className="pc__badge">
                {product.tag}
              </span>
            )}

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <span className="pc__discount-badge">
                -{discountPercentage}%
              </span>
            )}

            {/* Overlay Actions (hover on desktop) */}
            <div className="pc__overlay">
              <button
                type="button"
                className={`pc__like-btn ${liked ? 'pc__like-btn--active' : ''}`}
                onClick={handleLike}
                aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
                title={liked ? 'Favorited' : 'Add to favorites'}
              >
                <FaHeart />
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="pc__content">
            <h3 className="pc__title">{product.name}</h3>

            {/* Price Section */}
            <div className="pc__price-section">
              <span className="pc__price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.mrp && (
                <span className="pc__mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="pc__desc">{product.description}</p>
            )}
          </div>

          {/* Footer Section */}
          <div className="pc__footer">
            <button
              type="button"
              className={`pc__like-btn-mobile ${liked ? 'pc__like-btn-mobile--active' : ''}`}
              onClick={handleLike}
              aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FaHeart />
            </button>

            <button
              type="button"
              className="pc__add-cart-btn"
              onClick={handleAddToCart}
              disabled={loading}
              aria-busy={loading}
            >
              <FaShoppingBag className="pc__cart-icon" />
              <span>{loading ? 'Adding...' : 'Cart'}</span>
            </button>
          </div>
        </article>
      </Link>
    </div>
  )
}

export default ProductCard