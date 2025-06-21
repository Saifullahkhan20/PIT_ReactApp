import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { productsAPI, cartAPI } from '../services/api';
import { Alert } from 'react-bootstrap';
import { CartContext } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { fetchCartCount } = useContext(CartContext);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Define fetchProductDetails using useCallback to memoize it
  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load product details');
      console.error('Error fetching product details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]); // fetchProductDetails depends on id

  useEffect(() => {
    fetchProductDetails();
  }, [id, fetchProductDetails]); // fetchProductDetails is now stable due to useCallback

  const addToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/signin';
        return;
      }
      await cartAPI.addToCart({
        productId: id,
        quantity: quantity
      });
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      fetchCartCount();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setReviewSubmitted(true);
    // Here you would send the review to the backend
    setTimeout(() => setReviewSubmitted(false), 2500);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!product) return <div className="alert alert-info">Product not found</div>;

  // Use discount from product or fallback to 5%
  const discount = product.discount || 5;

  return (
    <div className="row">
      {showSuccessAlert && (
        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible className="position-absolute top-0 start-50 translate-middle-x mt-2 w-75" style={{ zIndex: 10 }}>
          Product added to cart successfully!
        </Alert>
      )}
      <div className="col-md-6 d-flex align-items-center justify-content-center mb-4 mb-md-0">
        <img
          src={
            product.image
              ? (product.image.startsWith('http') ? product.image : `/uploads/${product.image}`)
              : (product.mainImage ? (product.mainImage.startsWith('http') ? product.mainImage : `/uploads/${product.mainImage}`) : '/no-photo.jpg')
          }
          alt={product.name}
          className="img-fluid rounded shadow"
          style={{ maxHeight: '520px', maxWidth: '95%', width: '420px', height: 'auto', objectFit: 'contain', background: '#fff' }}
        />
      </div>
      <div className="col-md-6">
        <h1 className="mb-3">{product.name}</h1>
        {/* Price Section with Discount */}
        <div className="mb-4">
          <h4>Price</h4>
          {discount > 0 ? (
            <>
              <span className="text-decoration-line-through text-muted me-2">
                Rs {product.price.toLocaleString()}
              </span>
              <span className="text-primary h4 mb-0">
                Rs {Math.round(product.price * (1 - discount / 100)).toLocaleString()}
              </span>
              <span className="badge bg-success ms-2">{discount}% OFF</span>
            </>
          ) : (
            <span className="text-primary h4 mb-0">
              Rs {product.price.toLocaleString()}
            </span>
          )}
        </div>
        
        <div className="mb-4">
          <h4>Specifications</h4>
          <ul className="list-unstyled">
            {Object.entries(product.specs || {}).map(([key, value]) => (
              <li key={key} className="mb-2">
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h4>Description</h4>
          <p>{product.description}</p>
        </div>

        <div className="mb-4">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <div className="input-group" style={{ maxWidth: '200px' }}>
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            >
              -
            </button>
            <input
              type="number"
              className="form-control text-center"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setQuantity(prev => prev + 1)}
            >
              +
            </button>
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg w-100"
          onClick={addToCart}
        >
          Add to Cart
        </button>

        {/* User Review Section */}
        <div className="mt-5">
          <h4>Rate this Product</h4>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-3">
              {[1,2,3,4,5].map(star => (
                <FontAwesomeIcon
                  key={star}
                  icon={userRating >= star || hoverRating >= star ? fasStar : farStar}
                  className="mx-1"
                  style={{ cursor: 'pointer', color: userRating >= star || hoverRating >= star ? '#fbbf24' : '#ccc', fontSize: '2rem', transition: 'color 0.15s' }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setUserRating(star)}
                  data-testid={`star-${star}`}
                />
              ))}
            </div>
            <button type="submit" className="btn btn-outline-primary" disabled={userRating === 0}>
              Submit Review
            </button>
            {reviewSubmitted && (
              <div className="alert alert-success mt-3">Thank you for your review!</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails; 