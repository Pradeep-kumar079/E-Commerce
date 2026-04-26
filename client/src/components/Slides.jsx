import React, { useState, useEffect, useRef, useCallback } from 'react'
import './Slides.css'
import { Link } from 'react-router-dom'

const slides = [
  {
    img: 'banner1.jpeg',
    tag: 'New arrival',
    name: 'Product 1',
    desc: 'Description of Product 1. Showcase your best features with a compelling line or two.',
    price: '₹1,299',
    originalPrice: '₹1,999',
    link: '/products/1',
  },
  {
    img: 'banner2.jpeg',
    tag: 'Best seller',
    name: 'Product 2',
    desc: 'Description of Product 2. Showcase your best features with a compelling line or two.',
    price: '₹2,499',
    originalPrice: '₹3,499',
    link: '/products/2',
  },
  {
    img: 'banner3.jpeg',
    tag: 'Limited offer',
    name: 'Product 3',
    desc: 'Description of Product 3. Showcase your best features with a compelling line or two.',
    price: '₹899',
    originalPrice: '₹1,499',
    link: '/products/3',
  },
  {
    img: 'banner4.jpeg',
    tag: 'Top rated',
    name: 'Product 4',
    desc: 'Description of Product 4. Showcase your best features with a compelling line or two.',
    price: '₹3,199',
    originalPrice: '₹4,499',
    link: '/products/4',
  },
]

const AUTOPLAY_MS = 2500

const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sl__btn-icon">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sl__btn-icon">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const IconCart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sl__cta-icon">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
)

const Slides = () => {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  const goTo = useCallback((index) => {
    setCurrent(((index % slides.length) + slides.length) % slides.length)
  }, [])

  const prev = () => goTo(current - 1)
  const next = useCallback(() => goTo(current + 1), [current, goTo])

  useEffect(() => {
    if (paused) return
    timerRef.current = setTimeout(next, AUTOPLAY_MS)
    return () => clearTimeout(timerRef.current)
  }, [current, paused, next])

  return (
    <section
      className="sl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Progress bar */}
      <div className="sl__progress">
        <div
          key={current}
          className={`sl__progress-bar ${!paused ? 'sl__progress-bar--running' : ''}`}
          style={{ '--duration': `${AUTOPLAY_MS}ms` }}
        />
      </div>

      {/* Header */}
      <div className="sl__header">
        <div>
          <div className="sl__eyebrow">
            <span className="sl__eyebrow-dot" />
            Featured collection
          </div>
          <h2 className="sl__title">
            Shop smart, <span>live better.</span>
          </h2>
        </div>

        <div className="sl__nav">
          <button className="sl__nav-btn" onClick={prev} aria-label="Previous slide">
            <IconChevronLeft />
          </button>
          <button className="sl__nav-btn" onClick={next} aria-label="Next slide">
            <IconChevronRight />
          </button>
        </div>
      </div>

      {/* Track */}
      <div className="sl__track" aria-live="polite">
        <div
          className="sl__slides"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div className="sl__slide" key={i} aria-hidden={i !== current}>
              <img
                src={slide.img}
                alt={slide.name}
                className="sl__img"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <div className="sl__info">
                <span className="sl__tag">{slide.tag}</span>
                <h3 className="sl__name">{slide.name}</h3>
                <p className="sl__desc">{slide.desc}</p>
                <div className="sl__price">
                  {slide.price}
                  <span className="sl__price-original">{slide.originalPrice}</span>
                </div>
                <div className="sl__actions">
                  <Link to={slide.link} className="sl__cta-primary">
                    <IconCart />
                    Shop now
                  </Link>
                  <Link to={slide.link} className="sl__cta-secondary">
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="sl__dots" role="tablist">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`sl__dot ${i === current ? 'sl__dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === current}
            role="tab"
          />
        ))}
      </div>
    </section>
  )
}

export default Slides