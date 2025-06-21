import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductFilterAndSearch from '../components/ProductFilterAndSearch';
import PromoBanner from '../components/PromoBanner';
import { productsAPI } from '../services/api';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [bannerProduct, setBannerProduct] = useState(null);

  const fetchProducts = useCallback(async (filterAndSearchParams) => {
    try {
      setLoading(true);
      const params = filterAndSearchParams || Object.fromEntries(searchParams.entries());
      const response = await productsAPI.getAll(params);
      const productsData = Array.isArray(response.data) ? response.data : response.data.data;
      setProducts(Array.isArray(productsData) ? productsData : []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch Samsung S23 Ultra for the banner
  useEffect(() => {
    async function fetchBannerProduct() {
      try {
        const response = await productsAPI.getById('68511c0c9f6ef79f2bd8c684');
        setBannerProduct(response.data.data);
      } catch (err) {
        setBannerProduct(null);
      }
    }
    fetchBannerProduct();
  }, []);

  if (loading) return <div className="text-center py-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // Split products into phones and laptops (support string or populated object)
  const phones = products.filter(
    p =>
      (typeof p.category === 'string' && p.category.toLowerCase().includes('phone')) ||
      (typeof p.category === 'object' && p.category && typeof p.category.name === 'string' && p.category.name.toLowerCase().includes('phone'))
  );
  const laptops = products.filter(
    p =>
      (typeof p.category === 'string' && p.category.toLowerCase().includes('laptop')) ||
      (typeof p.category === 'object' && p.category && typeof p.category.name === 'string' && p.category.name.toLowerCase().includes('laptop'))
  );

  // Only show banner if there is no search query
  const hasSearch = !!searchParams.get('search');

  return (
    <div className="container-fluid">
      <ProductFilterAndSearch onApplyFiltersAndSearch={fetchProducts} />

      {!hasSearch && (
        <PromoBanner
          image={bannerProduct ? (bannerProduct.image.startsWith('http') ? bannerProduct.image : `/uploads/${bannerProduct.image}`) : '/no-photo.jpg'}
          title={bannerProduct ? bannerProduct.name : 'Samsung Galaxy S23 Ultra'}
          subtitle="Flagship Experience"
          description="Get the latest Samsung S23 Ultra with up to 5% off. Limited time summer offer!"
          ctaText="Shop Now"
          ctaLink="/product/68511c0c9f6ef79f2bd8c684"
          background="#000"
          textColor="#fff"
        />
      )}

      {/* Phones Section */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
        <h3 className="fw-bold">Latest Phones</h3>
        <Link to="/phones" className="btn btn-outline-primary">View All</Link>
      </div>
      <div className="row">
        {phones.slice(0, 4).map(product => (
          <div key={product._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <ProductCard product={product} />
          </div>
        ))}
        {phones.length === 0 && (
          <div className="col-12 text-center py-5">
            <h4>No phones found.</h4>
          </div>
        )}
      </div>

      {/* Laptops Section */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
        <h3 className="fw-bold">Latest Laptops</h3>
        <Link to="/laptops" className="btn btn-outline-primary">View All</Link>
      </div>
      <div className="row">
        {laptops.slice(0, 4).map(product => (
          <div key={product._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <ProductCard product={product} />
          </div>
        ))}
        {laptops.length === 0 && (
          <div className="col-12 text-center py-5">
            <h4>No laptops found.</h4>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home; 