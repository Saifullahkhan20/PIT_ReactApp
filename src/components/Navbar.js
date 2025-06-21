import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { AuthContext, CartContext } from '../App';
import { authAPI } from '../services/api';
import './Navbar.css';
import LoadingOverlay from './LoadingOverlay';

function Navbar() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const { cartItemCount, fetchCartCount } = useContext(CartContext);
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileBtnRef = useRef();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileBtnRef.current && !profileBtnRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        }
        if (showProfileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showProfileMenu]);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            fetchCartCount();
            navigate('/signin');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <>
            {loading && <LoadingOverlay />}
            {/* Floating Cart Button */}
            <Link to="/cart" className="floating-cart-btn">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#f5f8fa" />
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14l.84-2h7.45c.75 0 1.41-.41 1.75-1.03l3.24-5.88A1 1 0 0 0 19.45 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.09z" fill="#888" />
                </svg>
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </Link>

            {/* Navbar */}
            <div className="custom-navbar">
                <div className="navbar-section navbar-left">
                    {isLoggedIn ? (
                        <div className="profile-btn-navbar-wrapper" ref={profileBtnRef}>
                            <button className="profile-btn-navbar" onClick={() => setShowProfileMenu(v => !v)}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="12" fill="#e3eafc" />
                                    <path d="M12 12c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="#1565c0" />
                                </svg>
                            </button>
                            {showProfileMenu && (
                                <div className="profile-dropdown-navbar">
                                    <Link to="/profile" className="profile-dropdown-link">Profile</Link>
                                    <button className="profile-dropdown-link logout-link" onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    ) : null}
                    <Nav className="nav-links">
                        <Nav.Link as={Link} to="/" className="nav-item-fade">Home</Nav.Link>
                        <Nav.Link as={Link} to="/laptops" className="nav-item-fade">Laptops</Nav.Link>
                        <Nav.Link as={Link} to="/phones" className="nav-item-fade">Phones</Nav.Link>
                    </Nav>
                </div>
                <div className="navbar-section navbar-center">
                    <Link to="/" className="navbar-brand-centered">Phone Info Tech</Link>
                </div>
                <div className="navbar-section navbar-right">
                    <Nav className="align-items-center">
                        <Nav.Link as={Link} to="/about" className="nav-item-fade">About</Nav.Link>
                        <Nav.Link as={Link} to="/contact" className="nav-item-fade">Contact Us</Nav.Link>
                        {!isLoggedIn && (
                            <Nav.Link
                                as={Link}
                                to="/signin"
                                className="btn btn-primary px-3 me-2"
                                onClick={e => {
                                    e.preventDefault();
                                    setLoading(true);
                                    setTimeout(() => {
                                        setLoading(false);
                                        navigate('/signin');
                                    }, 400);
                                }}
                            >
                                Sign In / Sign Up
                            </Nav.Link>
                        )}
                    </Nav>
                </div>
            </div>
        </>
    );
}

export default Navbar;