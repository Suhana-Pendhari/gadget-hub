import React, { useState } from 'react'
import '../componentStyles/Product.css';
import { Link } from 'react-router-dom';
import Rating from './Rating';

function Product({product}) {
    const [rating, setRating] = useState(0);
    const originalPrice = Number(product?.price ?? 0);
    const discountPercent = Number(product?.discountPercent ?? 0);
    const discountedPrice = Math.round(originalPrice * (100 - discountPercent) / 100);
    const showDiscount = discountPercent > 0;

    const handleRatingChange = (newRating)=>{
        setRating(newRating);
    }
  return (
    <Link to={`/product/${product._id}`} className="product_id">
        <div className="product-card">
            <img src={product.image[0].url} alt={product.name} className='product-image-card'/>
            <div className="product-details">
                <h3 className="product-title">{product.name}</h3>
                <div className="home-price">
                    {showDiscount ? (
                        <>
                            <span className="original-price">{originalPrice}/-</span>
                            <span>{discountedPrice}/-</span>
                            <span className="discount-badge">{discountPercent}% OFF</span>
                        </>
                    ) : (
                        <span>{originalPrice}/-</span>
                    )}
                </div>
                <div className="rating_container">
                    <Rating
                    value={product.ratings}
                    onRatingChange={handleRatingChange}
                    disabled={true}
                    />
                </div>
                <span className="productCardSpan">
                    ( {product.numOfReviews} {product.numOfReviews===1?"Review":"Reviews"} )
                </span>
                <button className="add-to-cart">View Details</button>
            </div>
        </div>
    </Link>
  )
}

export default Product
