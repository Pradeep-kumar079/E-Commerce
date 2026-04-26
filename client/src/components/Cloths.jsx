import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from './ProductCard'
import './Cloth.css'

const Cloths = () => {
  const [cloths, setCloths] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const BASE_IMAGE_URL = 'https://e-commerce-backend-mwxg.onrender.com'

  useEffect(() => {
    const fetchCloths = async () => {
      try {
        setError(null)
        const res = await axios.get(
          `${BASE_IMAGE_URL}/api/home/all-products`,
          { timeout: 10000 }
        )
        const clothItems = res.data.filter((p) => p.category === 'clothing')
        setCloths(clothItems)
      } catch (err) {
        console.error('Error fetching cloths:', err)
        setError('Failed to load clothing items. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCloths()
  }, [])

  return (
    <section className="cloths-section" aria-label="Clothing Products">
      {/* ── HEADER ── */}
      <div className="cloths-header">
        <h2>Clothes</h2>
        <p>Explore our collection of fashionable and comfortable clothing.</p>
      </div>

      {/* ── CONTENT STATES ── */}
      {loading ? (
        <div className="cloths-loading" role="status" aria-live="polite">
          <span>Loading clothes...</span>
        </div>
      ) : error ? (
        <div className="cloths-empty" role="alert">
          <span>{error}</span>
        </div>
      ) : cloths.length === 0 ? (
        <div className="cloths-empty" role="status">
          <span>No clothing products available right now.</span>
        </div>
      ) : (
        <div className="cloths-list" role="region" aria-label="Clothing products list">
          {cloths.map((cloth) => (
            <div key={cloth._id} className="card-container">
              <ProductCard
                product={cloth}
                BASE_IMAGE_URL={BASE_IMAGE_URL}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Cloths