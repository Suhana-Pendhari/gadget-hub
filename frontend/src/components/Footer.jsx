import React from 'react';
import '../componentStyles/Footer.css';
import {Phone, Mail, LocationOn} from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
        <div className="footer-container">
            {/* Section1 */}
            <div className="footer-section contact">
                <h3>Contact Us</h3>
                <p><LocationOn fontSize='small'/> Shop No 1, Main Police Station Road,<br />
                near The Golden Supplement Shop,<br />
                Amruta Awati, Ashta, Maharashtra 41630</p>
                <p><Mail fontSize='small'/> Email: ghatagekedar555@gmail.com</p>
                <p><Phone fontSize='small'/> Phone: 7276781707 / 8668911485</p>
            </div>

            {/* Section2 */}
            <div className="footer-section links">
                <h3>Quick Links</h3>
                <ul>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/orders/user">My Orders</Link></li>
                </ul>
            </div>

            {/* Section3 */}
            <div className="footer-section about">
                <h3>About Gadget Hub</h3>
                <p>Your premier destination for automotive gadgets and accessories. We provide high-quality products to enhance your driving experience.</p>
                <p><strong>Owner: Mr. Kedar Pratap Ghatage</strong></p>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2025 Gadget Hub. All rights reserved</p>
        </div>
    </footer>
  )
}

export default Footer