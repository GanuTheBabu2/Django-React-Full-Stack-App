import React from 'react';
import { Home, Search, PlusCircle, Send, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/MobileNavbar.css';

const navItems = [
  { to: '/', icon: <Home />, label: 'Home' },
  { to: '/search', icon: <Search />, label: 'Search' }, // Updated from "#" to valid path
  { to: '/add-item', icon: <PlusCircle />, label: 'Add' },
  { to: '/request-product', icon: <Send />, label: 'Request' },
  { to: '/profile', icon: <User />, label: 'Profile' }, // Updated from "#" to valid path
];

const MobileNavbar = () => {
  const location = useLocation();

  return (
    <nav className="mobile-nav fancy-glass">
      <ul className="mobile-nav-list">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.to;
          return (
            <li key={index}>
              <Link
                to={item.to}
                className={`mobile-nav-link ${isActive ? 'active' : ''}`}
              >
                <div className={`icon-wrapper ${isActive ? 'pulse' : ''}`}>
                  {item.icon}
                </div>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileNavbar;
