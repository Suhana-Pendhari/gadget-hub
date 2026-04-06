import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import '../componentStyles/DiscountDealCard.css';

function DiscountDealCard({ product }) {
  const discount = Number(product?.discountPercent ?? 0);
  const originalPrice = Number(product?.price ?? 0);
  const finalPrice = Math.round(originalPrice * (100 - discount) / 100);

  const showDiscount = discount > 0;

  return (
    <Link to={`/product/${product._id}`} className="deal-card-link">
      <div className="deal-card">
        {showDiscount && (
          <div className="deal-discount-badge" aria-label={`${discount}% OFF`}>
            {discount}% OFF
          </div>
        )}

        <img src={product.image?.[0]?.url} alt={product.name} className="deal-image" />

        <div className="deal-body">
          <h3 className="deal-title">{product.name}</h3>

          <div className="deal-price-row">
            {showDiscount ? (
              <>
                <span className="deal-original-price">{originalPrice}/-</span>
                <span className="deal-final-price">{finalPrice}/-</span>
              </>
            ) : (
              <span className="deal-final-price">{originalPrice}/-</span>
            )}
          </div>

          <div className="deal-rating-row">
            <Rating value={product.ratings} disabled={true} />
          </div>

          <div className="deal-footer">
            <span className="deal-savings-text">
              {showDiscount ? `Save ${Math.round(originalPrice - finalPrice)} /-` : 'Best Price'}
            </span>
            <span className="deal-view-button">View Details</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default DiscountDealCard;

