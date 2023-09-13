import React from 'react';
import '../../css/Wizard/TemplateViews.css'; 

const TemplateViews = ({ views, selectedView, onSelect }) => {
  return (
    <div className="views-container">
      {views && views.map((view, index) => (
        <div
          key={index}
          className={`view-item ${selectedView === view ? 'selected' : ''}`}
          onClick={() => onSelect(view)}
        >
          <div className="icon-container">
            <img src="https://via.placeholder.com/150" alt={`${view}`} />
          </div>
          <span className="view-name">{view}</span>
        </div>
      ))}
    </div>
  );
};

export default TemplateViews;
