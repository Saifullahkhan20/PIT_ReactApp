import React, { useEffect, useState } from 'react';
import '../styles/About.css';

const About = () => {
  const [coords, setCoords] = useState({ lat: 31.5497, lng: 74.3436 }); // Default: Lahore
  const [locationLoaded, setLocationLoaded] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLocationLoaded(true);
        },
        () => setLocationLoaded(true)
      );
    } else {
      setLocationLoaded(true);
    }
  }, []);

  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About PhoneTechInfo</h1>
        <p>Your Trusted Source for Smartphone Information</p>
      </div>
      
      <div className="about-content">
        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
            At PhoneTechInfo, we are dedicated to providing comprehensive and accurate information
            about smartphones to help you make informed purchasing decisions. Our platform serves
            as a bridge between consumers and the latest mobile technology.
          </p>
        </section>

        <section className="what-we-do">
          <h2>What We Do</h2>
          <ul>
            <li>Detailed smartphone specifications and comparisons</li>
            <li>Expert reviews and analysis</li>
            <li>Latest mobile technology news</li>
            <li>Price tracking and market analysis</li>
            <li>User reviews and ratings</li>
          </ul>
        </section>

        <section className="why-choose-us">
          <h2>Why Choose Us</h2>
          <div className="features">
            <div className="feature">
              <h3>Accurate Information</h3>
              <p>We verify all specifications and details from official sources</p>
            </div>
            <div className="feature">
              <h3>Comprehensive Coverage</h3>
              <p>From budget to flagship devices, we cover them all</p>
            </div>
            <div className="feature">
              <h3>User-Focused</h3>
              <p>Our content is designed to help users make better decisions</p>
            </div>
          </div>
        </section>

        <section className="shop-location-section">
          <h2>Our Shop Location</h2>
          <div className="map-container">
            {locationLoaded ? (
              <iframe
                title="Shop Location"
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: '12px' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
              ></iframe>
            ) : (
              <div>Loading map...</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 