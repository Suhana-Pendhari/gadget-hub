import React, { useEffect, useState } from 'react';
import '../pageStyles/ProductDetails.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Rating from '../components/Rating';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createReview, getProductDetails, removeErrors, removeSuccess } from '../features/products/productSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { addItemsToCart, removeMessage } from '../features/cart/cartSlice';
import { getAllMyOrders } from '../features/order/orderSlice';


function ProductDetails() {
    const [userRating, setUserRating] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState('');
    const [comment, setComment] = useState("");

    const handleRatingChange = (newRating) => {
        setUserRating(newRating);
    }
    const { loading, error, product, reviewSuccess, reviewLoading } = useSelector((state) => state.product);
    const { isAuthenticated } = useSelector((state) => state.user);
    const { orders = [] } = useSelector((state) => state.order);
    const errorMessage = typeof error === 'string' ? error : error?.message;
    const { loading: cartLoading, error: cartError, success, message, cartItems } = useSelector((state) => state.cart);
    console.log(cartItems);


    const dispatch = useDispatch();
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            dispatch(getProductDetails(id));
        }
        if (isAuthenticated) {
            dispatch(getAllMyOrders());
        }
        return () => {
            dispatch(removeErrors())
        }
    }, [dispatch, id, isAuthenticated]);
    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors())
        }
        if (cartError) {
            toast.error(cartError, { position: 'top-center', autoClose: 3000 });
        }
    }, [dispatch, errorMessage, cartError]);

    useEffect(() => {
        if (success) {
            toast.success(message, { position: 'top-center', autoClose: 3000 });
            dispatch(removeMessage());
        }
    }, [dispatch, success, message]);

    const decreaseQuantity = () => {
        if (quantity <= 1) {
            toast.error('Quantity cannot be less than 1!', { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
            return;
        }
        setQuantity(qty => qty - 1);
    }
    const increaseQuantity = () => {
        if (product.stock <= quantity) {
            toast.error('Cannot exceed available stock!', { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
            return;
        }
        setQuantity(qty => qty + 1);
    }

    const addToCart = () => {
        dispatch(addItemsToCart({ id, quantity }));
    }

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!userRating) {
            toast.error('Please select a rating', { position: 'top-center', autoClose: 3000 });
            return;
        }
        dispatch(createReview({
            rating: userRating,
            comment,
            productId: id
        }))
    }

    useEffect(() => {
        if (reviewSuccess) {
            toast.success('Review submitted Successfully!', { position: 'top-center', autoClose: 3000 });
            setUserRating(0);
            setComment('');
            dispatch(removeSuccess());
            dispatch(getProductDetails(id));
        }
    }, [reviewSuccess, id, dispatch])

    useEffect(() => {
        if (product && product.image && product.image.length > 0) {
            setSelectedImage(product.image[0].url);
        }
    }, [product])

    const canReview = isAuthenticated && orders.some((order) =>
        order.orderStatus === 'Delivered' &&
        order.orderItems?.some((item) => String(item.product) === String(id))
    );
    if (loading) {
        return (
            <>
                <Navbar />
                <Loader />
                <Footer />
            </>
        )
    }
    if (error || !product) {
        return (
            <>
                <PageTitle title="Product Details" />
                <Navbar />
                <Footer />
            </>
        )
    }

    return (
        <>
            <PageTitle title={`${product.name} - Details`} />
            <Navbar />
            <div className="product-details-container">
                <div className="product-detail-container">
                    <div className="product-image-container">
                        <img src={selectedImage} alt={product.name} className='product-detail-image' />
                        {product.image.length > 1 && (<div className="product-thumbnails">
                            {product.image.map((img, index) => (
                                <img src={img.url} alt={`Thumbnail ${index + 1}`} className='thumbnail-image' onClick={() => setSelectedImage(img.url)} />
                            ))}
                        </div>)}
                    </div>

                    <div className="product-info">
                        <h2>{product.name}</h2>
                        <p className="product-description">{product.description}</p>
                        {product.discountPercent > 0 ? (
                          <div className="product-price-block">
                            <p className="product-price product-original-price">Price : {product.price}/-</p>
                            <p className="product-price product-discounted-price">Discounted : {Math.round(product.price * (100 - product.discountPercent) / 100)}/-</p>
                            <span className="product-discount-label">{product.discountPercent}% OFF</span>
                          </div>
                        ) : (
                          <p className="product-price">Price : {product.price}/-</p>
                        )}
                        <div className="product-rating">
                            <Rating
                                value={product.ratings}
                                disabled={true}
                            />
                            <span className="productCardSpan">( {product.numOfReviews} {product.numOfReviews === 1 ? "Review" : "Reviews"} )</span>
                        </div>
                        <div className="stock-status">
                            <span className={product.stock > 0 ? `in-stock` : `out-of-stock`}>{product.stock > 0 ? `In Stock (${product.stock} available)` : `Out of Stock`}</span>
                        </div>

                        {product.stock > 0 && (<>
                            <div className="quantity-controls">
                                <span className='quantity-label'>Quantity:</span>
                                <button className="quantity-button" onClick={decreaseQuantity}>-</button>
                                <input type="text" value={quantity} className='quantity-value' readOnly />
                                <button className="quantity-button" onClick={increaseQuantity}>+</button>
                            </div>
                            <button className="add-to-cart-btn" onClick={addToCart} disabled={cartLoading}>{cartLoading ? 'Adding' : 'Add to Cart'}</button>
                        </>)
                        }

                        <form className={`review-form ${canReview ? '' : 'review-form-disabled'}`} onSubmit={handleReviewSubmit}>
                            <h3>Write a Review</h3>
                            <Rating
                                value={userRating}
                                disabled={!canReview}
                                onRatingChange={handleRatingChange}
                            />
                            <textarea
                                placeholder={canReview ? 'Write your review here..' : 'Review will unlock after delivery of this product.'}
                                className='review-input'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                                disabled={!canReview}
                            ></textarea>
                            {!canReview && (
                                <p className="review-locked-note">
                                    Review is locked until this product is delivered in your order history.
                                </p>
                            )}
                            <button className="submit-review-btn" disabled={reviewLoading || !canReview}>
                                {reviewLoading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="reviews-container">
                    <h3>Customer Reviews</h3>
                    {product.reviews && product.reviews.length > 0 ? (<div className="reviews-section">
                        {product.reviews.map((review, index) => (
                            <div className="review-item" key={index}>
                                <div className="review-header">
                                    <Rating value={review.rating} disabled={true} />
                                </div>
                                <p className="review-comment">{review.comment}</p>
                                <p className="review-name">By : {review.name}</p>
                            </div>
                        ))}
                    </div>) : (
                        <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ProductDetails
