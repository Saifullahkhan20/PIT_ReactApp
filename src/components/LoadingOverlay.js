import React from 'react';

const LoadingOverlay = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(255,255,255,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
  }}>
    <div className="spinner-border text-primary" role="status" style={{ width: 60, height: 60 }}>
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default LoadingOverlay; 