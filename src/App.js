import React, { useState, useEffect, createContext, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './styles/common.css';
import { cartAPI } from './services/api';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Categories from './pages/Categories';
import Brands from './pages/Brands';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Laptops from './pages/Laptops';
import Phones from './pages/Phones';
import Checkout from './pages/Checkout';

export const AuthContext = createContext(null);
export const CartContext = createContext(0); // Create CartContext with default value 0

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0); // State for cart item count

  // Define fetchCartCount using useCallback to memoize it
  const fetchCartCount = useCallback(async () => {
    console.log('App: fetchCartCount called');
    try {
      const response = await cartAPI.getCart();
      const count = response.data.data.items.reduce((acc, item) => acc + item.quantity, 0);
      console.log('App: Calculated cart count', count);
      setCartItemCount(count);
    } catch (err) {
      console.error('App: Error fetching cart count:', err);
      setCartItemCount(0); // Reset count on error
    }
  }, []); // Empty dependency array as it doesn't depend on props or state that change often

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      fetchCartCount(); // Fetch cart count if logged in
    }
  }, [fetchCartCount]); // fetchCartCount is now stable due to useCallback

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <CartContext.Provider value={{ cartItemCount, setCartItemCount, fetchCartCount }}>
      <Router>
        <div className="App">
          <Navbar />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/signin" element={<Login />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/laptops" element={<Laptops />} />
              <Route path="/phones" element={<Phones />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
