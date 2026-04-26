import React from 'react'
import './Categories.css'
import { Link } from 'react-router-dom'

const categories = [
  { label: 'Fashion',         img: 'modern1.jpeg',  to: '/products?category=fashion' },
  { label: 'Electronics',     img: 'gad6.jpeg',     to: '/products?category=electronics' },
  { label: 'Home Appliances', img: 'app4.jpeg',     to: '/products?category=home-appliances' },
  { label: 'Books',           img: 'book.jpeg',     to: '/products?category=books' },
  { label: 'Toys',            img: 'toy2.jpeg',     to: '/products?category=toys' },
  { label: 'Sports',          img: 'sports.jpeg',   to: '/products?category=sports' },
  { label: 'Health',          img: 'health.jpeg',   to: '/products?category=health' },
  { label: 'Beauty',          img: 'beauty.jpeg',   to: '/products?category=beauty' },
  { label: 'Automotive',      img: 'auto.jpeg',     to: '/products?category=automotive' },
  { label: 'Grocery',         img: 'grocery.jpeg',  to: '/products?category=grocery' },
  { label: 'Pet Supplies',    img: 'pet.jpeg',      to: '/products?category=pet-supplies' },
  { label: 'Music',           img: 'music.jpeg',    to: '/products?category=music' },
]

const Categories = () => {
  return (
    <section className="cat">
      <div className="cat__header">
        <div>
          <div className="cat__eyebrow">
            <span className="cat__eyebrow-dot" />
            Browse by type
          </div>
          <h2 className="cat__title">
            Shop by <span>category</span>
          </h2>
        </div>
        <span className="cat__count">{categories.length} categories</span>
      </div>

      <div className="cat__scroll">
        {categories.map(({ label, img, to }) => (
          <Link to={to} className="cat__card" key={label}>
            <div className="cat__img-wrap">
              <img src={img} alt={label} loading="lazy" />
              <div className="cat__overlay" />
            </div>
            <div className="cat__label">{label}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Categories