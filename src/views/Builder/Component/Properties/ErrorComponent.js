import React from 'react';
import '../../../../css/Builder/Component/Properties/ErrorComponent.css';

function ErrorComponent({ error, onRetry }) {
  return (
    <div className="error-container">
      <span className="error-text">Error saving the property</span>
      <button className="retry-button" onClick={onRetry}>
        <i className="bi bi-arrow-clockwise"></i> Retry
      </button>
    </div>
  );
}

export default ErrorComponent;
