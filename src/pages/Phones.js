import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productsAPI } from '../services/api'; // Import productsAPI
import ProductCard from '../components/ProductCard'; // Import ProductCard
import ProductFilterAndSearch from '../components/ProductFilterAndSearch'; // Import the new component
import '../styles/ProductListing.css'; // Assuming a common style for product listings

const Phones = () => {
  const [phones, setPhones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const fetchPhones = useCallback(async (filterAndSearchParams) => {
      try {
      setLoading(true);
      const params = filterAndSearchParams || Object.fromEntries(searchParams.entries());
      // Ensure the category filter is always 'Phone'
      params.category = 'Phone';

      const response = await productsAPI.getAll(params);
      if (response.data && response.data.success) {
        setPhones(response.data.data);
        setError(null);
        } else {
        setError(response.data?.message || 'Failed to fetch phones');
        }
      } catch (err) {
        setError('An error occurred while fetching phones.');
        console.error('Error fetching phones:', err);
      } finally {
        setLoading(false);
      }
  }, [searchParams]);

  useEffect(() => {
    fetchPhones();
  }, [fetchPhones]);

  if (loading) {
    return <div className="loading">Loading phones...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="product-listing-container container mt-4">
      <ProductFilterAndSearch onApplyFiltersAndSearch={fetchPhones} initialCategoryFilter="Phone" />
      <h2 className="mb-4">Phones</h2>
      <div className="row">
        {phones.length > 0 ? (
          phones.map(product => (
            <div key={product._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p className="col-12 text-center">No phones found.</p>
        )}
      </div>
    </div>
  );
};

export default Phones; 