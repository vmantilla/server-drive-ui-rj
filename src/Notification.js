import React from 'react';
import './css/Notification.css';

const Notification = ({ variant, message, onClose }) => {
  return (
    <div className={`notification ${variant}`}>
      {message}
      <button onClick={onClose}>X</button>
    </div>
  );
};

export default Notification;