import React, { useEffect } from 'react';
import '../CartStyles/PaymentSuccess.css';
import { Link, useSearchParams } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Loader from '../components/Loader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createOrder, removeErrors, removeSuccess } from '../features/order/orderSlice.js';
import { clearCart } from '../features/cart/cartSlice.js';


function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get('reference');
    const method = searchParams.get('method') || 'online';
    const { cartItems, shippingInfo } = useSelector(state => state.cart);
    const { loading, success, error, order } = useSelector(state => state.order);

    const dispatch = useDispatch();

    useEffect(() => {
        const createOrderData = async () => {
            try {
                const orderItem = JSON.parse(sessionStorage.getItem('orderItem'));
                if(!orderItem) return;
                const orderData = {
                    shippingInfo: {
                        address: shippingInfo.address,
                        city: shippingInfo.city,
                        state: shippingInfo.state,
                        country: shippingInfo.country,
                        pinCode: shippingInfo.pincode,
                        phoneNo: shippingInfo.phoneNumber
                    },
                    orderItems: cartItems.map((item) => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                        product: item.product
                    })),
                    paymentInfo: {
                        id: method === 'cod' ? 'COD' : reference,
                        status: method === 'cod' ? 'pending' : 'succeeded'
                    },
                    itemPrice: orderItem.subtotal,
                    taxPrice: orderItem.tax,
                    shippingPrice: orderItem.shippingCharges,
                    totalPrice: orderItem.total
                }
                console.log('sending Data', orderData);
                dispatch(createOrder(orderData));
                sessionStorage.removeItem('orderItem');
            } catch (error) {
                console.log('Order creation error', error.message);
                toast.error(error.message || 'Order creation error', { position: 'top-center', autoClose: 3000 });
            }
        }
        createOrderData();
    }, [])
    useEffect(() => {
        if (success) {
            toast.success('Order Placed', { position: 'top-center', autoClose: 3000 });
            dispatch(clearCart());
            dispatch(removeSuccess());
        }
    }, [dispatch, success])

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error])
    return (
        <>
            {loading ? (<Loader />) : (<>
                <PageTitle title="Payment Status" />
                <Navbar />
                <div className="payment-success-container">
                    <div className="success-content">

                        <div className="success-icon">
                            <div className="checkmark"></div>
                        </div>
                        <h1>Order Confirmed!</h1>
                        {method === 'cod' ? (
                            <p>Cash on Delivery selected. Please keep exact cash ready at delivery.</p>
                        ) : (
                            <p>Your payment was successful. Reference ID <strong>{reference}</strong></p>
                        )}
                        {order?.estimatedDeliveryDate ? (
                            <p>Expected delivery by <strong>{new Date(order.estimatedDeliveryDate).toDateString()}</strong>.</p>
                        ) : (
                            <p>Expected delivery within <strong>7 days</strong>.</p>
                        )}
                        <Link className='explore-btn' to='/orders/user'>View Orders</Link>
                    </div>
                </div>
                <Footer />
            </>)}
        </>
    )
}

export default PaymentSuccess