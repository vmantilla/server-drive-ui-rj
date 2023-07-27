// Archivo: PreviewWithScreenshot.js
import React, { useEffect, useState } from 'react';

const PreviewWithScreenshot = ({ base64Image }) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    setImage(base64Image);
  }, [base64Image]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '5px solid black',
      borderRadius: '10px',
      width: '100px',  // Cambie esto al tamaño que desee
      height: '200px'  // Cambie esto al tamaño que desee
    }}>
      {image && <img src={image} alt="Simulator Preview" />}
    </div>
  );
};

export default PreviewWithScreenshot;
