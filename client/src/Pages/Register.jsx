import React, { useState } from 'react'
import axios from 'axios'
import './Register.css'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const [data, setData] = useState({ name: '', email: '', password: '', phone: '' })
  const navigate = useNavigate()

  const handleChange = (field) => (e) => setData({ ...data, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('https://e-commerce-backend-mwxg.onrender.com/api/auth/register', data)
      alert(res.data.msg)
      navigate('/login')
    } catch (err) {
      alert(err?.response?.data?.msg || 'Registration failed')
    }
  }

  return (
    <div className="register">
      <form className="register__card" onSubmit={handleSubmit} noValidate>

        {/* ── Left panel ── */}
        <div className="register__left">
          <Link to="/" className="register__logo">
            <span className="register__logo-dot" />
            ShopMart
          </Link>

          <div className="register__promo">
            <span className="register__promo-tag">New member offer</span>
            <h2 className="register__promo-heading">
              Shop smart,<br />
              <span>live better.</span>
            </h2>
            <p className="register__promo-text">
              Join thousands of happy shoppers and unlock exclusive deals,
              early access, and a seamless checkout experience.
            </p>
            <hr className="register__promo-divider" />
            <div className="register__features">
              {[
                'Exclusive member-only discounts',
                'Order tracking in real time',
                'Fast, secure checkout',
              ].map((f) => (
                <div className="register__feature" key={f}>
                  <span className="register__feature-dot" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <p className="register__signin-hint">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>

        {/* ── Right panel (form) ── */}
        <div className="register__right">
          <h1 className="register__heading">Create account</h1>
          <p className="register__subheading">Fill in your details to get started.</p>

          {/* Name + Phone row */}
          <div className="register__row">
            <div className="register__field">
              <label className="register__label" htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                className="register__input"
                placeholder="John Doe"
                value={data.name}
                onChange={handleChange('name')}
                required
              />
            </div>
            <div className="register__field">
              <label className="register__label" htmlFor="reg-phone">Phone</label>
              <input
                id="reg-phone"
                className="register__input"
                type="tel"
                placeholder="+91 98765 43210"
                value={data.phone}
                onChange={handleChange('phone')}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="register__field">
            <label className="register__label" htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              className="register__input"
              type="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={handleChange('email')}
              required
            />
          </div>

          {/* Password */}
          <div className="register__field">
            <label className="register__label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              className="register__input"
              type="password"
              placeholder="Min. 8 characters"
              value={data.password}
              onChange={handleChange('password')}
              required
            />
          </div>

          {/* Terms */}
          <label className="register__terms">
            <input type="checkbox" required />
            I agree to the{' '}
            <Link to="/terms">terms &amp; conditions</Link>
          </label>

          {/* Submit */}
          <button type="submit" className="register__btn-primary">
            Create account
          </button>

          {/* OR */}
          <div className="register__or">
            <div className="register__or-line" />
            <span>or</span>
            <div className="register__or-line" />
          </div>

          {/* Google */}
          <button type="button" className="register__btn-google">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt=""
            />
            Continue with Google
          </button>
        </div>

      </form>
    </div>
  )
}

export default Register