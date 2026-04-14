import React from 'react';
import '../pageStyles/AboutUs.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import { LocationOn, Phone, Mail } from '@mui/icons-material';

function AboutUs() {
    return (
        <>
            <Navbar />
            <PageTitle title="About Us" />
            <div className="about-us-container">
                <div className="about-hero">
                    <h1>Welcome to Gadget Hub</h1>
                    <p>Your Premier Destination for Automotive Gadgets & Accessories</p>
                </div>

                <div className="about-us-content">
                    {/* Mission Section */}
                    <section className="about-section">
                        <h2>🎯 Our Mission</h2>
                        <p>At Gadget Hub, we are committed to providing innovative automotive gadgets that make driving safer, more convenient, and enjoyable. We believe in quality products at competitive prices.</p>
                    </section>

                    {/* About Company Section */}
                    <section className="about-section">
                        <h2>💼 About Company</h2>
                        <p>Gadget Hub is your premier destination for automotive gadgets and accessories. We specialize in providing high-quality products to enhance your driving experience and vehicle performance.</p>
                        <p>With years of experience in the automotive industry, we have built a reputation for excellence and customer satisfaction.</p>
                    </section>

                    {/* Owner Section */}
                    <section className="about-section owner-section">
                        <h2>👤 Meet Our Owner</h2>
                        <div className="owner-card">
                            <h3>Mr. Kedar Pratap Ghatage</h3>
                            <p className="position">Founder & Owner</p>
                            <p>Gadget Hub (Automotive Gadget Store)</p>
                            <p className="contact-info">📱 Mobile: 7276781707</p>
                        </div>
                    </section>

                    {/* Shop Location Section */}
                    <section className="about-section location-section">
                        <h2>📍 Visit Our Shop</h2>
                        <div className="shop-info">
                            <div className="shop-details">
                                <h3>Gadget Hub - Ashta</h3>
                                <p><LocationOn /> Shop No 1, Main Police Station Road</p>
                                <p>near The Golden Supplement Shop</p>
                                <p>Amruta Awati, Ashta, Maharashtra 41630</p>
                                <p><Phone /> 7276781707 / 8668911485</p>
                                <p><Mail /> ghatagekedar555@gmail.com</p>
                            </div>
                            <div className="shop-image">
                                <div className="image-placeholder">
                                    <p>Shop Front Image</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Why Choose Us */}
                    <section className="about-section features-section">
                        <h2>✨ Why Choose Us?</h2>
                        <div className="features-grid">
                            <div className="feature-card">
                                <h4>🎁 Quality Products</h4>
                                <p>Premium automotive gadgets for all vehicle types</p>
                            </div>
                            <div className="feature-card">
                                <h4>💰 Best Prices</h4>
                                <p>Competitive pricing with great value for money</p>
                            </div>
                            <div className="feature-card">
                                <h4>🚚 Fast Delivery</h4>
                                <p>Quick and reliable delivery to your doorstep</p>
                            </div>
                            <div className="feature-card">
                                <h4>😊 Expert Support</h4>
                                <p>Friendly customer service and expert advice</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default AboutUs;