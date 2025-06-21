import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalBrands: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, categories, brands, orders] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories'),
          axios.get('/api/brands'),
          axios.get('/api/orders')
        ]);

        setStats({
          totalProducts: products.data.length,
          totalCategories: categories.data.length,
          totalBrands: brands.data.length,
          totalOrders: orders.data.length
        });
        setLoading(false);
      } catch (err) {
        setError('Error loading dashboard data');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Products</h5>
              <p className="card-text display-4">{stats.totalProducts}</p>
              <Link to="/admin/products" className="btn btn-light">Manage Products</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Categories</h5>
              <p className="card-text display-4">{stats.totalCategories}</p>
              <Link to="/admin/categories" className="btn btn-light">Manage Categories</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Brands</h5>
              <p className="card-text display-4">{stats.totalBrands}</p>
              <Link to="/admin/brands" className="btn btn-light">Manage Brands</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Orders</h5>
              <p className="card-text display-4">{stats.totalOrders}</p>
              <Link to="/admin/orders" className="btn btn-light">Manage Orders</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="list-group">
                <Link to="/admin/products/new" className="list-group-item list-group-item-action">
                  Add New Product
                </Link>
                <Link to="/admin/categories/new" className="list-group-item list-group-item-action">
                  Add New Category
                </Link>
                <Link to="/admin/brands/new" className="list-group-item list-group-item-action">
                  Add New Brand
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Recent Activity</h5>
              <p className="text-muted">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 