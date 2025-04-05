import React from 'react';
import { Home, Search, PlusCircle, Send, User } from 'lucide-react';
import '../styles/MobileNavbar.css';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation

const MobileNavbar = () => {
  const location = useLocation(); // Get current location

  return (
    <nav className="mobile-nav">
      <ul className="mobile-nav-list">
        <li>
          <Link to="/" className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <Home className="mobile-nav-icon" />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="#" className="mobile-nav-link">
            <Search className="mobile-nav-icon" />
            <span>Search</span>
          </Link>
        </li>
        <li>
          <Link to="/add-item" className={`mobile-nav-link ${location.pathname === '/add-item' ? 'active' : ''}`}>
            <PlusCircle className="mobile-nav-icon" />
            <span>Add</span>
          </Link>
        </li>
        <li>
          <Link to="/request-product" className={`mobile-nav-link ${location.pathname === '/request-product' ? 'active' : ''}`}>
            <Send className="mobile-nav-icon" />
            <span>Request</span>
          </Link>
        </li>
        <li>
          <Link to="#" className="mobile-nav-link">
            <User className="mobile-nav-icon" />
            <span>Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavbar;
