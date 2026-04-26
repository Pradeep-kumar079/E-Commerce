import React, { useState } from 'react'
import axios from 'axios'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

function Login() {
  const [data, setData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (field) => (e) => setData({ ...data, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('https://e-commerce-backend-mwxg.onrender.com/api/auth/login', data)
      alert('Login Successful')

      const token = res.data.token
      localStorage.setItem('token', token)

      const decoded = jwtDecode(token)
      const userId = res.data.user?._id || decoded.userId || decoded._id
      localStorage.setItem('userId', userId)

      if (res.data.user?.role === 'admin' || res.data.user?.isAdmin) {
        navigate('/admin-dashboard')
      } else {
        navigate('/home')
      }

      setData({ email: '', password: '' })
    } catch (err) {
      if (err.response) {
        alert(err.response.data?.msg || 'Login failed')
      } else if (err.request) {
        alert('No response from server')
      } else {
        alert('Error: ' + err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <form className="login__card" onSubmit={handleSubmit} noValidate>

        {/* ── Left panel ── */}
        <div className="login__left">
          <Link to="/" className="login__logo">
            <span className="login__logo-dot" />
            ShopMart
          </Link>

          <div className="login__promo">
            <span className="login__promo-tag">Member access</span>
            <h2 className="login__promo-heading">
              Good to have<br />
              <span>you back.</span>
            </h2>
            <p className="login__promo-text">
              Sign in to continue your seamless shopping experience
              and pick up right where you left off.
            </p>
            <hr className="login__promo-divider" />
            <div className="login__features">
              {[
                'Access your orders & wishlist',
                'Saved addresses & payment',
                'Exclusive member deals',
              ].map((f) => (
                <div className="login__feature" key={f}>
                  <span className="login__feature-dot" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <p className="login__register-hint">
            New here?{' '}
            <Link to="/">Create an account</Link>
          </p>
        </div>

        {/* ── Right panel (form) ── */}
        <div className="login__right">
          <h1 className="login__heading">Welcome back</h1>
          <p className="login__subheading">Enter your credentials to sign in.</p>

          {/* Email */}
          <div className="login__field">
            <label className="login__label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              className="login__input"
              type="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={handleChange('email')}
              required
            />
          </div>

          {/* Password */}
          <div className="login__field">
            <label className="login__label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="login__input"
              type="password"
              placeholder="Your password"
              value={data.password}
              onChange={handleChange('password')}
              required
            />
          </div>

          {/* Forgot password */}
          <div className="login__forgot">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="login__btn-primary"
            disabled={loading || !data.email || !data.password}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* OR */}
          <div className="login__or">
            <div className="login__or-line" />
            <span>or</span>
            <div className="login__or-line" />
          </div>

          {/* Google */}
          <button type="button" className="login__btn-google">
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

export default Login