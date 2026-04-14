import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import '../componentStyles/MobileBottomNav.css';

const navItems = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Categories', path: '/products', icon: <CategoryIcon /> },
  { label: 'Cart', path: '/cart', icon: <ShoppingCartIcon /> },
  { label: 'Contact', path: '/contact', icon: <ContactSupportIcon /> },
];

function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          className={location.pathname === item.path ? 'mobile-nav-item active' : 'mobile-nav-item'}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default MobileBottomNav;
