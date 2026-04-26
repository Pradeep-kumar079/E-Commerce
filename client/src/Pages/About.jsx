import React from "react";
import "./About.css";
import Navbar from "../components/Navbar";

const IcoHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

const About = () => {
  return (
    <div className="cont">
      <Navbar />

      <div className="about-container">

        {/* ── Hero card ── */}
        <div className="about-card">

          {/* Top: heading */}
          <div className="about-card-top">
            <div className="about-eyebrow">Our Story</div>
            <h1 className="about-heading">About Us</h1>
            <p className="about-subheading">
              Dedicated to delivering the best online shopping experience — every product, every day.
            </p>
          </div>

          {/* CEO section */}
          <div className="about-ceo">
            <div className="about-ceo-img-wrap">
              <img
                src="/app5.jpeg"
                alt="CEO Mohan Kumar"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentNode.querySelector(".about-ceo-fallback").style.display = "block";
                }}
              />
              <span className="about-ceo-fallback" style={{ display: "none" }}>M</span>
            </div>
            <div className="about-ceo-info">
              <span className="about-ceo-label">Founder &amp; CEO</span>
              <div className="about-ceo-name">Mohan Kumar</div>
              <div className="about-ceo-desc">
                Visionary entrepreneur with a passion for e-commerce and customer-first innovation.
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="about-body">
            <p className="about-text">
              Welcome to our <span className="highlight">E-Commerce Platform</span>. We are dedicated to providing
              the best online shopping experience through a curated selection of quality products at competitive prices.
            </p>
            <p className="about-text">
              Our mission is to put <span className="highlight">customer satisfaction</span> at the heart of everything
              we do — from seamless browsing and secure checkout to fast delivery and responsive support.
            </p>
          </div>

          {/* Stats */}
          <div className="about-stats">
            <div className="about-stat">
              <div className="about-stat-num">10K+</div>
              <div className="about-stat-label">Products</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-num">50K+</div>
              <div className="about-stat-label">Happy Customers</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-num">99%</div>
              <div className="about-stat-label">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* ── Thank you badge ── */}
        <div className="about-thanks">
          <div className="about-thanks-icon"><IcoHeart /></div>
          <p>Thank you for choosing us. We're constantly improving to serve you better.</p>
        </div>

        {/* ── Footer ── */}
        <footer className="about-footer">
          <p>&copy; {new Date().getFullYear()} E-Commerce Platform. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
};

export default About;