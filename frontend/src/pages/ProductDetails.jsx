import React, { useEffect, useState } from 'react';
import '../pageStyles/ProductDetails.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Rating from '../components/Rating';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createReview, getProductDetails, removeErrors, removeSuccess } from '../features/products/productSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { addItemsToCart, removeMessage, clearCart } from '../features/cart/cartSlice';
import { getAllMyOrders } from '../features/order/orderSlice';


function ProductDetails() {
    const [userRating, setUserRating] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedMedia, setSelectedMedia] = useState({ type: 'image', url: null });
    const [isBuyNow, setIsBuyNow] = useState(false);
    const [showCartToast, setShowCartToast] = useState(false);
    const getVideoUrl = (videoItem) => {
        if (!videoItem) return null;
        if (typeof videoItem === 'string') return videoItem;
        return videoItem.url || videoItem.secure_url || null;
    };

    const [comment, setComment] = useState("");

    const handleRatingChange = (newRating) => {
        setUserRating(newRating);
    }
    const { loading, error, product, reviewSuccess, reviewLoading } = useSelector((state) => state.product);
    const { isAuthenticated } = useSelector((state) => state.user);
    const { orders = [] } = useSelector((state) => state.order);
    const errorMessage = typeof error === 'string' ? error : error?.message;
    const { loading: cartLoading, error: cartError, success, message, cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
            if (showCartToast) {
                toast.success(message, { position: 'top-center', autoClose: 3000 });
            }
            dispatch(removeMessage());
            setShowCartToast(false);
            setIsBuyNow(false);
        }
    }, [dispatch, success, message, showCartToast]);

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
        setShowCartToast(true);
        dispatch(addItemsToCart({ id, quantity }));
    }

    const buyNow = () => {
        setIsBuyNow(true);
        dispatch(clearCart());
        dispatch(addItemsToCart({ id, quantity }));
        navigate('/shipping');
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
        const firstImageUrl = product?.image?.[0]?.url || null;
        const firstVideoUrl = getVideoUrl(product?.video?.[0]);
        if (firstImageUrl) {
            setSelectedMedia({ type: 'image', url: firstImageUrl });
        } else if (firstVideoUrl) {
            setSelectedMedia({ type: 'video', url: firstVideoUrl });
        } else {
            setSelectedMedia({ type: 'image', url: null });
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
                        <div className="main-media-view">
                            {selectedMedia.type === 'video' && selectedMedia.url ? (
                                <video
                                    key={selectedMedia.url}
                                    controls
                                    playsInline
                                    preload="metadata"
                                    className='product-video'
                                >
                                    <source src={selectedMedia.url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : selectedMedia.url ? (
                                <img src={selectedMedia.url} alt={product.name} className='product-detail-image' />
                            ) : (
                                <div className='product-detail-image' aria-hidden="true"></div>
                            )}
                        </div>
                        <div className="media-strip">
                            {product.image?.map((img, index) => (
                                img?.url ? (
                                <button
                                    type="button"
                                    key={img.public_id || img.url || `img-${index}`}
                                    className={`media-thumb ${selectedMedia.type === 'image' && selectedMedia.url === img.url ? 'active' : ''}`}
                                    onClick={() => setSelectedMedia({ type: 'image', url: img.url })}
                                    aria-label={`Image ${index + 1}`}
                                >
                                    <img src={img.url} alt={`Thumbnail ${index + 1}`} className='thumbnail-image' />
                                </button>
                                ) : null
                            ))}
                            {product.video?.map((vid, index) => {
                                const videoUrl = getVideoUrl(vid);
                                if (!videoUrl) return null;
                                return (
                                    <button
                                        type="button"
                                        key={vid.public_id || videoUrl || `vid-${index}`}
                                        className={`media-thumb media-video-thumb ${selectedMedia.type === 'video' && selectedMedia.url === videoUrl ? 'active' : ''}`}
                                        onClick={() => setSelectedMedia({ type: 'video', url: videoUrl })}
                                        aria-label={`Video ${index + 1}`}
                                    >
                                        <video muted preload="metadata" className='thumbnail-video'>
                                            <source src={videoUrl} type="video/mp4" />
                                        </video>
                                        <span className="media-play-badge">▶</span>
                                    </button>
                                );
                            })}
                        </div>
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
                            <div className="product-action-buttons">
                                <button className="add-to-cart-btn" onClick={addToCart} disabled={cartLoading}>{cartLoading ? 'Adding' : 'Add to Cart'}</button>
                                <button className="buy-now-btn" onClick={buyNow} disabled={cartLoading}>Buy Now</button>
                            </div>
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
