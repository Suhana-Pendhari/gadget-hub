import React, { useEffect, useMemo, useState } from 'react';
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
    const [locationLib, setLocationLib] = useState({ Country: null, State: null, City: null });

    useEffect(() => {
        let isMounted = true;

        import('country-state-city')
            .then((module) => {
                if (isMounted) {
                    setLocationLib({
                        Country: module.Country,
                        State: module.State,
                        City: module.City
                    });
                }
            })
            .catch(() => {
                toast.error('Failed to load location data', { position: 'top-center', autoClose: 3000 });
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const countries = useMemo(
        () => (locationLib.Country ? locationLib.Country.getAllCountries() : []),
        [locationLib.Country]
    );
    const states = useMemo(
        () => (country && locationLib.State ? locationLib.State.getStatesOfCountry(country) : []),
        [country, locationLib.State]
    );
    const cities = useMemo(
        () => (country && state && locationLib.City ? locationLib.City.getCitiesOfState(country, state) : []),
        [country, state, locationLib.City]
    );

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
                            <select name="country" id="country" value={country} onChange={(e) => {
                                setCountry(e.target.value)
                                setState('');
                                setCity('');
                            }}>
                                <option value="">Select a Country</option>
                                {countries.map((item) => (
                                    <option value={item.isoCode} key={item.isoCode}>{item.name}</option>
                                ))}
                            </select>
                        </div>

                        {country && <div className="shipping-form-group">
                            <label htmlFor="state">State</label>
                            <select name="state" id="state" value={state} onChange={(e) => {
                                setState(e.target.value);
                                setCity('');
                            }}>
                                <option value="">Select a State</option>
                                {states.map((item) => (
                                    <option value={item.isoCode} key={item.isoCode}>{item.name}</option>
                                ))}
                            </select>
                        </div>}

                        {state && <div className="shipping-form-group">
                            <label htmlFor="city">City</label>
                            <select name="city" id="city" value={city} onChange={(e) => setCity(e.target.value)}>
                                <option value="">Select a City</option>
                                {cities.map((item) => (
                                    <option value={item.name} key={item.name}>{item.name}</option>
                                ))}
                            </select>
                        </div>}
                    </div>

                    <button className="shipping-submit-btn">Continue</button>
                </form>
            </div>
            <Footer />
        </>
    )
}

export default Shipping