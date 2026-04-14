import React from 'react';
import '../CartStyles/Cart.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartItem from './CartItem';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {

    const { cartItems } = useSelector(state => state.cart);
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal*0.18;
    const shipping = subtotal>500?0:50;
    const total = subtotal+tax+shipping;

    const navigate = useNavigate();

    const checkoutHandler = ()=>{
        navigate(`/login?redirect=/shipping`);
    }

    return (
        <>
            <PageTitle title="Your Cart" />
            <Navbar />
            {cartItems.length === 0 ? (
                <div className="empty-cart-container">
                    <p className="empty-cart-message">Your cart is empty</p>
                    <Link to="/products" className='viewProducts'>View Products</Link>
                </div>
            ) : (<>

                <div className="cart-page">
                    <div className="cart-items">
                        <div className="cart-items-heading">Your Cart</div>
                        <div className="cart-table">
                            <div className="cart-table-header">
                                <div className="header-product">Product</div>
                                <div className="header-quantity">Quantity</div>
                                <div className="header-total item-total-heading">Item Total</div>
                                <div className="header-action item-total-heading">Actions</div>
                            </div>

                            {/* Cart Items */}
                            {cartItems && cartItems.map(item => <CartItem item={item} key={item.name} />)}

                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="price-summary">
                        <h3 className="price-summary-heading">Price Summary</h3>
                        <div className="summary-item">
                            <p className="summary-label">Subtotal :</p>
                            <p className="summary-value">{Number.isFinite(subtotal) ? subtotal.toFixed(2) : '0.00'}/-</p>
                        </div>
                        <div className="summary-item">
                            <p className="summary-label">Tax (18%):</p>
                            <p className="summary-value">{Number.isFinite(tax) ? tax.toFixed(2) : '0.00'}/-</p>
                        </div>
                        <div className="summary-item">
                            <p className="summary-label">Shipping :</p>
                            <p className="summary-value">{Number.isFinite(shipping) ? shipping.toFixed(2) : '0.00'}/-</p>
                        </div>
                        <div className="summary-total">
                            <p className="total-label">Total :</p>
                            <p className="total-value">{Number.isFinite(total) ? total.toFixed(2) : '0.00'}/-</p>
                        </div>
                        <button className="checkout-btn" onClick={checkoutHandler}>Proceed to Checkout</button>
                    </div>
                </div>

            </>)}
            <Footer />
        </>
    )
}

export default Cart