import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api'; // Import cartAPI
import { CartContext } from '../App'; // Import CartContext

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchCartCount } = useContext(CartContext); // Use fetchCartCount from context
  const navigate = useNavigate();

  // Define fetchCart using useCallback to memoize it
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      // Ensure user is logged in to fetch cart
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your cart.');
        setLoading(false);
        // Also, ensure the Navbar's cart count is 0 if not logged in
        fetchCartCount(); 
        return;
      }
      
      // Use cartAPI.getCart instead of direct axios.get
      const response = await cartAPI.getCart();
      setCartItems(response.data.data.items || []); // Ensure items array is set, even if cart is empty
      setError(null);
      fetchCartCount(); // Update cart count in Navbar after fetching cart
    } catch (err) {
      // Check if error is due to cart not found (404) or unauthorized (401)
      if (err.response && (err.response.status === 404 || err.response.status === 401)) {
        setCartItems([]); // Set cart as empty if not found or unauthorized
        setError(null); // Clear error as it's an expected state (empty cart or not logged in)
        fetchCartCount(); // Also update Navbar's cart count to 0 if cart is not found or unauthorized
      } else {
        setError('Failed to load cart');
        console.error('Error fetching cart:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchCartCount]); // fetchCart depends on fetchCartCount

  useEffect(() => {
    fetchCart();
  }, [fetchCart]); // fetchCart is now stable due to useCallback

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to update your cart.');
        return;
      }
      // Use cartAPI.updateCartItem instead of direct axios.put
      await cartAPI.updateCartItem(itemId, { quantity: newQuantity });
      fetchCart(); // Refresh cart after update
    } catch (error) {
      console.error('Error updating cart:', error);
      setError('Failed to update cart item.');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to remove items from your cart.');
        return;
      }
      // Use cartAPI.removeFromCart instead of direct axios.delete
      await cartAPI.removeFromCart(itemId);
      fetchCart(); // Refresh cart after removal
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item from cart.');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  // Display specific error messages or an empty cart message
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h1 className="mb-4">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p>Your cart is empty</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            item.product.image
                              ? (item.product.image.startsWith('http') ? item.product.image : `/uploads/${item.product.image}`)
                              : (item.product.mainImage ? (item.product.mainImage.startsWith('http') ? item.product.mainImage : `/uploads/${item.product.mainImage}`) : '/no-photo.jpg')
                          }
                          alt={item.product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="me-3"
                        />
                        <Link to={`/product/${item.product._id}`}>
                          {item.product.name}
                        </Link>
                      </div>
                    </td>
                    <td>Rs {item.product.price.toLocaleString()}</td>
                    <td>
                      <div className="input-group" style={{ maxWidth: '150px' }}>
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
                            updateQuantity(item._id, newQuantity);
                          }}
                          min="1"
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>Rs {(item.product.price * item.quantity).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeItem(item._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row justify-content-end">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Order Summary</h5>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Subtotal:</span>
                    <span>Rs {calculateTotal().toLocaleString()}</span>
                  </div>
                  <button className="btn btn-primary w-100" onClick={() => navigate('/checkout')}>
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart; 