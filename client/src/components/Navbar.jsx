import React, { useState } from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCartShopping,
  faBars,
  faTimes,
  faHome,
  faBox,
  faInfoCircle,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { to: "/home", label: "Home", icon: faHome },
    { to: "/products", label: "Products", icon: faBox },
    { to: "/about", label: "About", icon: faInfoCircle },
    { to: "/account", label: "Account", icon: faUser },
    { to: "/cart", label: "Cart", icon: faCartShopping },
    { to: "/logout", label: "Logout", icon: faRightToBracket },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-logo">My Store</h1>
      </div>

      {/* Mobile menu button */}
      <button
        className="menubar"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>

      {/* Links */}
      <ul className={`nav-links ${isOpen ? "show" : ""}`}>
        <li className="nameblock">
          <h3>Hello, Pradeep</h3>
        </li>

        {navLinks.map((item) => (
          <li key={item.to} className="nav-item">
            <Link to={item.to} onClick={closeMenu}>
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
