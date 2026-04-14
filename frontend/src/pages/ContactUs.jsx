import React, { useState } from 'react';
import '../pageStyles/ContactUs.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import { Mail, Phone, LocationOn } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const { data } = await axios.post('/api/v1/contact/submit', formData);
            if (data.success) {
                toast.success('Message sent successfully! We will contact you soon.', {
                    position: 'top-center',
                    autoClose: 3000
                });
                
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: ''
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to send message. Please try again.', {
                position: 'top-center',
                autoClose: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <PageTitle title="Contact Us" />
            <div className="contact-us-container">
                <div className="contact-us-content">
                    <div className="contact-wrapper">
                        {/* Left Side - Contact Info */}
                        <div className="contact-info-section">
                            <h2>Contact Information</h2>
                            
                            <div className="info-card">
                                <LocationOn className="info-icon" />
                                <div className="info-text">
                                    <h4>Our Location</h4>
                                    <p>Shop No 1, Main Police Station Road</p>
                                    <p>Ashta, Maharashtra 41630</p>
                                </div>
                            </div>

                            <div className="info-card">
                                <Phone className="info-icon" />
                                <div className="info-text">
                                    <h4>Phone Numbers</h4>
                                    <p>7276781707</p>
                                    <p>8668911485</p>
                                </div>
                            </div>

                            <div className="info-card">
                                <Mail className="info-icon" />
                                <div className="info-text">
                                    <h4>Email</h4>
                                    <p>ghatagekedar555@gmail.com</p>
                                </div>
                            </div>

                            <div className="info-card owner-card">
                                <div className="owner-avatar">K</div>
                                <div className="info-text">
                                    <h4>Owner</h4>
                                    <p><strong>Mr. Kedar Pratap Ghatage</strong></p>
                                    <p className="owner-title">Founder & Owner</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Contact Form */}
                        <div className="contact-form-section">
                            <h2>Send us a Message</h2>
                            <p className="form-subtitle">We'll get back to you as soon as possible</p>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        placeholder="Your full name" 
                                        value={formData.name}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        placeholder="your@email.com" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        id="phone" 
                                        name="phone" 
                                        placeholder="Your phone number" 
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message *</label>
                                    <textarea 
                                        id="message" 
                                        name="message" 
                                        placeholder="Type your message here..." 
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ContactUs;