import React, { useState } from 'react';

function Checkout() {
  const [shipping, setShipping] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (Object.values(shipping).some(v => !v)) {
      alert('Please fill in all shipping fields.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container mt-5">
        <div className="alert alert-success">
          <h4>Order Placed Successfully!</h4>
          <p>Thank you for your purchase. Your order is being processed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="row g-4">
        <div className="col-md-6">
          <h4>Shipping Information</h4>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" name="name" value={shipping.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input type="text" className="form-control" name="address" value={shipping.address} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">City</label>
            <input type="text" className="form-control" name="city" value={shipping.city} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Postal Code</label>
            <input type="text" className="form-control" name="postalCode" value={shipping.postalCode} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input type="text" className="form-control" name="phone" value={shipping.phone} onChange={handleChange} required />
          </div>
        </div>
        <div className="col-md-6">
          <h4>Payment Method</h4>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name="paymentMethod" id="cod" value="cod" checked={paymentMethod === 'cod'} onChange={handlePaymentChange} />
            <label className="form-check-label" htmlFor="cod">Cash on Delivery</label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name="paymentMethod" id="card" value="card" checked={paymentMethod === 'card'} onChange={handlePaymentChange} />
            <label className="form-check-label" htmlFor="card">Credit/Debit Card</label>
          </div>
          {paymentMethod === 'card' && (
            <div className="mb-3">
              <label className="form-label">Card Number</label>
              <input type="text" className="form-control" placeholder="Card Number" required />
            </div>
          )}
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-success btn-lg w-100">Place Order</button>
        </div>
      </form>
    </div>
  );
}

export default Checkout; 