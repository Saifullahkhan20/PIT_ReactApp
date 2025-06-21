import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { cartAPI } from '../services/api';
import './ProductCard.css';
import { Alert } from 'react-bootstrap';
import { CartContext } from '../App';

function ProductCard({ product }) {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { fetchCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} className="text-warning" />);
    }
    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-warning" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={farStar} className="text-warning" />);
    }

    return stars;
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      
      await cartAPI.addToCart({
        productId: product._id,
        quantity: 1
      });
      
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      fetchCartCount();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div
      className="card product-card h-100 shadow-sm hover-shadow"
      onClick={() => navigate(`/product/${product._id}`)}
      style={{ cursor: 'pointer' }}
    >
      {showSuccessAlert && (
        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible className="position-absolute top-0 start-50 translate-middle-x mt-2 w-75" style={{ zIndex: 10 }}>
          Product added to cart successfully!
        </Alert>
      )}
      <div className="position-relative d-flex align-items-center justify-content-center" style={{ background: '#fff', height: '200px', width: '100%' }}>
        <img
          src={
            product.image
              ? (product.image.startsWith('http') ? product.image : `/uploads/${product.image}`)
              : (product.mainImage ? (product.mainImage.startsWith('http') ? product.mainImage : `/uploads/${product.mainImage}`) : '/no-photo.jpg')
          }
          className="card-img-top"
          alt={product.name}
          style={{ maxHeight: '180px', maxWidth: '95%', width: 'auto', height: 'auto', objectFit: 'contain', background: '#fff', display: 'block', margin: '0 auto' }}
        />
        {product.discount > 0 && (
          <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded">
            {product.discount}% OFF
          </div>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        <div className="mb-2">
          <span className="badge bg-primary me-2">{product.category.name}</span>
        </div>
        
        <h5 className="card-title text-truncate" title={product.name}>
          {product.name}
        </h5>
        
        <div className="mb-2">
          {renderRating(product.rating || 0)}
          <small className="text-muted ms-1">({product.numReviews || 0} reviews)</small>
        </div>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              {product.discount > 0 ? (
                <>
                  <span className="text-decoration-line-through text-muted me-2">
                    Rs {product.price.toLocaleString()}
                  </span>
                  <span className="text-primary h4 mb-0">
                    Rs {Math.round(product.price * (1 - product.discount / 100)).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-primary h4 mb-0">
                  Rs {product.price.toLocaleString()}
                </span>
              )}
            </div>
            <small className="text-success">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </small>
          </div>
          
          <div className="d-grid gap-2">
            <button
              className="btn btn-outline-primary"
              onClick={e => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
            >
              View Details
            </button>
            <button
              onClick={e => { e.stopPropagation(); addToCart(); }}
              className="btn btn-primary"
              disabled={product.stock === 0}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard; 