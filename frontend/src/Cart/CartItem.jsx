import React, { memo, useState } from 'react';
import '../CartStyles/Cart.css';
import { toast } from 'react-toastify';
import { addItemsToCart, removeErrors, removeItemFromCart } from '../features/cart/cartSlice';
import { useDispatch } from 'react-redux';

function CartItem({ item, loading }) {

    const [quantity, setQuantity] = useState(item.quantity);
    const dispatch = useDispatch();

    const decreaseQuantity = () => {
        if (quantity <= 1) {
            toast.error('Quantity cannot be less than 1!', { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
            return;
        }
        setQuantity(qty => qty - 1);
    }
    const increaseQuantity = () => {
        if (item.stock <= quantity) {
            toast.error('Cannot exceed available stock!', { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
            return;
        }
        setQuantity(qty => qty + 1);
    }

    const handleUpdate = () => {
        if (loading) return;
        if (quantity !== item.quantity) {
            dispatch(addItemsToCart({ id: item.product, quantity }));
        }
    }

    const handleRemove = ()=>{
        if(loading) return;
        dispatch(removeItemFromCart(item.product));
        toast.success("Item removed from cart successfully", { position: 'top-center', autoClose: 3000, toastId:'cart-update' });
    }

    return (
        <div className="cart-item">
            <div className="item-info">
                <img src={item.image} alt={item.name} className='item-image' loading="lazy" decoding="async" />
                <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price"><strong>Price: </strong>{item.price.toFixed(2)}/-</p>
                    <p className="item-quantity"><strong>Quantity: </strong>{item.quantity}</p>
                </div>
            </div>

            <div className="quantity-controls">
                <button className="quantity-button decrease-btn" onClick={decreaseQuantity} disabled={loading}>-</button>
                <input type="number" value={quantity} className='quantity-input' readOnly min="1" />
                <button className="quantity-button increase-btn" onClick={increaseQuantity} disabled={loading}>+</button>
            </div>

            <div className="item-total">
                <span className="item-total-price">{(item.price * item.quantity).toFixed(2)}/-</span>
            </div>

            <div className="item-actions">
                <button type="button" className="update-item-btn" onClick={handleUpdate} disabled={loading || quantity === item.quantity}>
                    {loading ? 'Updating' : 'Update'}
                </button>
                <button type="button" className="remove-item-btn" disabled={loading} onClick={handleRemove}>
                    Remove
                </button>
            </div>

        </div>
    )
}

export default memo(CartItem)