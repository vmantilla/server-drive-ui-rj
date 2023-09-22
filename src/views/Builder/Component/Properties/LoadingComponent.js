import React from 'react';
import '../../../../css/Builder/Component/Properties/LoadingComponent.css';

function LoadingComponent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '40px' }}>
      <div className="spinner"></div>
      <span className="loading-text">Loading...</span>
    </div>
  );
}

export default LoadingComponent;
