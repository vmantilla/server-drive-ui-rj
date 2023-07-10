// Archivo: PreviewGrid.js

import React, { useState, useEffect } from 'react';
import { fetchJsonFile } from '../helpers/utils';
import Preview from './Preview';
import '../css/thumbnailsViews.css';

const PreviewGrid = () => {
  const [viewsData, setViewsData] = useState([]);

  useEffect(() => {
    fetchJsonFile('./file.json').then(data => {
      setViewsData(data);
    });
  }, []);

  return (
    <div className="thumbnails-grid">
      {viewsData.map((viewData, index) => (
        <div 
          key={index} 
          className="thumbnail"
        >
          <span className="thumbnail-title">{viewData.title}</span>
          <Preview themesData={viewData.themesData} /> 
        </div>
      ))}
    </div>
  );
};

export default PreviewGrid;
