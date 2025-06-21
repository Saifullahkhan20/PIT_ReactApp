import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-rounded text-light mt-5 py-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h5>PhoneInfotec</h5>
                        <p>Your one-stop shop for phones and laptops.</p>
                    </div>
                    <div className="col-md-4">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/#phones">Phones</Link></li>
                            <li><Link to="/#laptops">Laptops</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Contact Us</h5>
                        <ul className="list-unstyled">
                            <li>Email: f223857@cfd.nu.edu.pk</li>
                            <li>Phone: (555) 123-4567</li>
                            <li>Address: 123 Tech Street, Faisalabad, Pakistan</li>
                        </ul>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <p>&copy; {new Date().getFullYear()} PhoneInfotec. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 