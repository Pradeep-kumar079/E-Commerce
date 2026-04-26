import React, { useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

/* ── Inline SVG icons (no FA dependency needed) ── */
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nb__icon">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const IconProducts = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nb__icon">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a4 4 0 00-8 0v2" />
  </svg>
)
const IconAbout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nb__icon">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
)
const IconAccount = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nb__icon">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const IconCart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nb__icon">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
)
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nb__icon">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nb__icon">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
)
const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nb__icon">
    <line x1="18" y1="6" x2="6" y2="6" />
    <line x1="18" y1="12" x2="6" y2="12" />
    <line x1="18" y1="18" x2="6" y2="18" />
  </svg>
)
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nb__icon">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const navLinks = [
  { to: '/home',     label: 'Home',     Icon: IconHome },
  { to: '/products', label: 'Products', Icon: IconProducts },
  { to: '/about',    label: 'About',    Icon: IconAbout },
]

const drawerLinks = [
  { to: '/home',     label: 'Home',     Icon: IconHome },
  { to: '/products', label: 'Products', Icon: IconProducts },
  { to: '/about',    label: 'About',    Icon: IconAbout },
  { to: '/account',  label: 'Account',  Icon: IconAccount },
]

const Navbar = ({ userName = 'Pradeep', cartCount = 3 }) => {
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  return (
    <nav className="nb">
      {/* ── Logo ── */}
      <Link to="/home" className="nb__logo" onClick={close}>
        <span className="nb__logo-dot" />
        ShopMart
      </Link>

      {/* ── Desktop nav links ── */}
      <ul className="nb__links">
        {navLinks.map(({ to, label, Icon }) => (
          <li key={to}>
            <Link to={to} className="nb__link">
              <Icon />
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* ── Desktop actions ── */}
      <div className="nb__actions">
        <button className="nb__icon-btn" aria-label="Search">
          <IconSearch />
        </button>

        <Link to="/cart" className="nb__icon-btn nb__icon-btn--rel" aria-label="Cart">
          <IconCart />
          {cartCount > 0 && <span className="nb__badge">{cartCount}</span>}
        </Link>

        <span className="nb__divider" />

        <Link to="/account" className="nb__user">
          <span className="nb__avatar">{userName.charAt(0).toUpperCase()}</span>
          <span className="nb__user-name">{userName}</span>
        </Link>

        <Link to="/logout" className="nb__logout">
          <IconLogout />
          Logout
        </Link>
      </div>

      {/* ── Mobile: cart + hamburger ── */}
      <div className="nb__mobile-actions">
        <Link to="/cart" className="nb__icon-btn nb__icon-btn--rel" aria-label="Cart">
          <IconCart />
          {cartCount > 0 && <span className="nb__badge">{cartCount}</span>}
        </Link>

        <button
          className="nb__menu-btn"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <div className={`nb__drawer ${isOpen ? 'nb__drawer--open' : ''}`}>
        <div className="nb__drawer-user">
          <span className="nb__drawer-avatar">{userName.charAt(0).toUpperCase()}</span>
          <div>
            <p className="nb__drawer-name">{userName}</p>
            <p className="nb__drawer-email">{userName.toLowerCase()}@example.com</p>
          </div>
        </div>

        {drawerLinks.map(({ to, label, Icon }) => (
          <Link key={to} to={to} className="nb__drawer-link" onClick={close}>
            <Icon />
            {label}
          </Link>
        ))}

        <Link to="/logout" className="nb__drawer-logout" onClick={close}>
          <IconLogout />
          Logout
        </Link>
      </div>
    </nav>
  )
}

export default Navbar