// Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../componentStyles/Logo.css';

function Logo() {
  return (
    <Link to="/" className="logo-container">
      <div className="logo-wrapper">
        <span className="logo-icon">⚡</span>
        <div className="logo-text">
          <span className="logo-gadget">GADGET</span>
          <span className="logo-hub">HUB</span>
        </div>
        <span className="logo-icon">⚡</span>
      </div>
      <div className="logo-tagline">Your Ultimate Tech Destination</div>
    </Link>
  );
}

export default Logo;
