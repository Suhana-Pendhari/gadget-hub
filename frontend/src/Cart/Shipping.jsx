import React, { useState } from 'react';
import '../CartStyles/Shipping.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckoutPath from './CheckoutPath';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { saveShippingInfo } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';

function Shipping() {
    const { shippingInfo } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [address, setAddress] = useState(shippingInfo.address || "");
    const [pincode, setPincode] = useState(shippingInfo.pincode || "");
    const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber || "");
    const [country, setCountry] = useState(shippingInfo.country || "");
    const [state, setState] = useState(shippingInfo.state || "");
    const [city, setCity] = useState(shippingInfo.city || "");

    const shippingInfoSubmit = (e) => {
        e.preventDefault();
        if (phoneNumber.length !== 10) {
            toast.error("Invalid Phone number! It should be 10 digits", { position: 'top-center', autoClose: 3000 });
            return;
        }
        dispatch(saveShippingInfo({ address, pincode, phoneNumber, country, state, city }));
        navigate('/order/confirm');
    }

    return (
        <>
            <PageTitle title="Shipping Info" />
            <Navbar />
            <CheckoutPath activePath={0} />
            <div className="shipping-form-container">
                <h1 className="shipping-form-header">Shipping Details</h1>
                <form className="shipping-form" onSubmit={shippingInfoSubmit}>
                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label htmlFor="address">Address</label>
                            <input type="text" id='address' name='address' placeholder='Enter your address' value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>

                        <div className="shipping-form-group">
                            <label htmlFor="pincode">Pincode</label>
                            <input type="number" id='pincode' name='pincode' placeholder='Enter your pincode' value={pincode} onChange={(e) => setPincode(e.target.value)} />
                        </div>

                        <div className="shipping-form-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input type="tel" id='phoneNumber' name='phoneNumber' placeholder='Enter your phone number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                    </div>

                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label htmlFor="country">Country</label>
                            <input type="text" id='country' name='country' placeholder='Enter your country' value={country} onChange={(e) => setCountry(e.target.value)} />
                        </div>

                        <div className="shipping-form-group">
                            <label htmlFor="state">State</label>
                            <input type="text" id='state' name='state' placeholder='Enter your state' value={state} onChange={(e) => setState(e.target.value)} />
                        </div>

                        <div className="shipping-form-group">
                            <label htmlFor="city">City</label>
                            <input type="text" id='city' name='city' placeholder='Enter your city' value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                    </div>

                    <button className="shipping-submit-btn">Continue</button>
                </form>
            </div>
            <Footer />
        </>
    )
}

export default Shipping