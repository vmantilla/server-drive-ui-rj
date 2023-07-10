// Archivo: PreviewGrid.js
import React, { useState, useEffect, useCallback } from 'react';
import { fetchJsonFile } from '../../helpers/utils';
import PreviewWithScreenshot from './PreviewWithScreenshot';
import '../../css/thumbnailsViews.css';

const PreviewGrid = ({ themesData }) => {
  const [gridViewsData, setGridViewsData] = useState([]);
  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
    fetchJsonFile('./file.json').then(data => {
      setGridViewsData(prevViewsData => [data]);
    });
  }, []);

  const handleScreenshotReady = useCallback((screenshot) => {
    setScreenshots(prevScreenshots => [...prevScreenshots, screenshot]);
  }, []);

  const isValidGridViewsData = Array.isArray(gridViewsData) && gridViewsData.length > 0;

  return (
  <div className="thumbnails-grid">
    {
      isValidGridViewsData && gridViewsData.map((viewData, index) => (
        <div key={index} className="thumbnail">
          <span className="thumbnail-title">{viewData.title}</span>
          {screenshots[index]
            ? <img
                src={screenshots[index]}
                alt={`Thumbnail for ${viewData.title}`}
                style={{ maxHeight: '100px', width: 'auto' }}
              />
            : <PreviewWithScreenshot themesData={themesData} viewData={viewData} onScreenshotReady={handleScreenshotReady} />}
        </div>
      ))
    }
  </div>
);

};

export default PreviewGrid;
