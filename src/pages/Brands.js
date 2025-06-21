import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('/api/brands');
        setBrands(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error loading brands');
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container">
      <h2 className="mb-4">Brands</h2>
      <div className="row">
        {brands.map((brand) => (
          <div key={brand._id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{brand.name}</h5>
                <p className="card-text">{brand.description}</p>
                <Link to={`/brand/${brand._id}`} className="btn btn-primary">
                  View Products
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands; 