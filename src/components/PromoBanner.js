import React from 'react';

const PromoBanner = ({
  image,
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
  background = '#000',
  textColor = '#fff'
}) => (
  <div
    style={{
      width: '100%',
      background,
      color: textColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '2.5rem 2rem',
      borderRadius: '24px',
      margin: '32px 0',
      overflow: 'hidden',
      minHeight: 320
    }}
  >
    <div style={{ flex: 1 }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 12 }}>{title}</h2>
      <h4 style={{ fontWeight: 400, marginBottom: 16 }}>{subtitle}</h4>
      <p style={{ fontSize: '1.2rem', marginBottom: 24 }}>{description}</p>
      {ctaText && (
        <a href={ctaLink} className="btn btn-light btn-lg" style={{ color: background }}>
          {ctaText}
        </a>
      )}
    </div>
    <div style={{ flex: 1, textAlign: 'right' }}>
      <img src={image} alt={title} style={{ maxHeight: 260, maxWidth: '100%', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }} />
    </div>
  </div>
);

export default PromoBanner; 