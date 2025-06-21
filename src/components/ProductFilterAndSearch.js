import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { categoriesAPI, brandsAPI } from '../services/api';

function ProductFilterAndSearch({ onApplyFiltersAndSearch, initialCategoryFilter = null }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState(() => {
    // Initialize filters from URL params or default
    const initialFilters = {
      category: searchParams.get('category')?.split(',') || (initialCategoryFilter ? [initialCategoryFilter] : []),
      brand: searchParams.get('brand')?.split(',') || [],
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sort') || 'newest'
    };
    return initialFilters;
  });
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoriesAPI.getAll();
      if (response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        console.error('Invalid categories data format received:', response.data);
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await brandsAPI.getAll();
      if (response.data && Array.isArray(response.data.data)) {
        setBrands(response.data.data);
      } else {
        console.error('Invalid brands data format received:', response.data);
        setBrands([]);
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, [fetchCategories, fetchBrands]);

  useEffect(() => {
    // When URL params change, update internal state
    setSearchQuery(searchParams.get('search') || '');
    setFilters(prev => ({
      ...prev,
      category: searchParams.get('category')?.split(',') || (initialCategoryFilter ? [initialCategoryFilter] : []),
      brand: searchParams.get('brand')?.split(',') || [],
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sort') || 'newest'
    }));
  }, [searchParams, initialCategoryFilter]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters(); // Apply current filters and search
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      let newValue;
      if (name === 'category' && initialCategoryFilter) { // For Laptops/Phones pages, only allow one category
        newValue = checked ? [value] : [];
      } else {
        newValue = checked
          ? [...filters[name], value]
          : filters[name].filter(item => item !== value);
      }
      setFilters(prev => ({ ...prev, [name]: newValue }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.append('search', searchQuery);
    if (filters.category.length) params.append('category', filters.category.join(','));
    if (filters.brand.length) params.append('brand', filters.brand.join(','));
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sortBy) params.append('sort', filters.sortBy);

    setSearchParams(params); // Update URL
    onApplyFiltersAndSearch(params); // Notify parent component
  };

  return (
    <div className="container-fluid">
      {/* Search Bar and Filter Button */}
      <div className="row mb-4">
        <div className="col-md-10 mx-auto d-flex align-items-center">
          <form onSubmit={handleSearchSubmit} className="d-flex flex-grow-1 me-2">
            <input
              type="search"
              name="search"
              className="form-control me-2"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit" className="btn btn-primary">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>
      </div>

      <div className="row">
        {/* Filters Sidebar (conditionally rendered) */}
        {showFilters && (
          <div className="col-md-3">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Filters</h5>
                <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }}>
                  {/* Category Filters */}
                  <div className="mb-3">
                    <h6>Categories</h6>
                    {categories.map(category => (
                      <div key={category._id} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`category-${category._id}`}
                          name="category"
                          value={category._id}
                          onChange={handleFilterChange}
                          checked={filters.category.includes(category._id) || (initialCategoryFilter && category.name === initialCategoryFilter)}
                          disabled={!!initialCategoryFilter && category.name !== initialCategoryFilter} // Disable other categories if initialCategoryFilter is set
                        />
                        <label className="form-check-label" htmlFor={`category-${category._id}`}>
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Brand Filters */}
                  <div className="mb-3">
                    <h6>Brands</h6>
                    {brands.map(brand => (
                      <div key={brand._id} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`brand-${brand._id}`}
                          name="brand"
                          value={brand._id}
                          onChange={handleFilterChange}
                          checked={filters.brand.includes(brand._id)}
                        />
                        <label className="form-check-label" htmlFor={`brand-${brand._id}`}>
                          {brand.name}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Price Range */}
                  <div className="mb-3">
                    <h6>Price Range</h6>
                    <div className="row g-2">
                      <div className="col">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Min"
                          name="minPrice"
                          value={filters.minPrice}
                          onChange={handleFilterChange}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Max"
                          name="maxPrice"
                          value={filters.maxPrice}
                          onChange={handleFilterChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="mb-3">
                    <h6>Sort By</h6>
                    <select
                      className="form-select"
                      name="sortBy"
                      value={filters.sortBy}
                      onChange={handleFilterChange}
                    >
                      <option value="newest">Newest</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="name_asc">Name: A to Z</option>
                      <option value="name_desc">Name: Z to A</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary w-100">Apply Filters</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* This prop is for the product listing area in the parent component */}
        <div className={showFilters ? "col-md-9" : "col-12"}>
          {/* Removed: Product listing will appear here. */}
        </div>
      </div>
    </div>
  );
}

export default ProductFilterAndSearch; 