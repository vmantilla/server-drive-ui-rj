import React, { useState } from "react";
import { Modal, Button, FormControl } from "react-bootstrap";

const shapes = {
  none: 0,
  extraSmall: 8,
  small: 12,
  medium: 16,
  large: 24,
  extraLarge: 32,
  full: 48,
};

const PaddingPickerWidget = (props) => {
  const { onChange, themesData } = props;
  const value = props.value || { shape: 'none' }; 

  const initialPadding = {
    top: shapes[value.shape],
    right: shapes[value.shape],
    bottom: shapes[value.shape],
    left: shapes[value.shape],
  };

  const [paddingValues, setPaddingValues] = useState(initialPadding);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleShapeClick = (shapeKey) => {
    const shapeValue = shapes[shapeKey];
    const newPaddingValues = {
      top: shapeValue,
      right: shapeValue,
      bottom: shapeValue,
      left: shapeValue,
    };
    setPaddingValues(newPaddingValues);
    onChange(newPaddingValues);
  };

  const handlePaddingChange = (paddingKey, event) => {
    const newPaddingValues = {
      ...paddingValues,
      [paddingKey]: isNaN(event.target.value) ? "" : parseInt(event.target.value),
    };
    setPaddingValues(newPaddingValues);
    onChange(newPaddingValues);
  };

  console.log(themesData);

  return (
    <>
      <Button 
        variant="primary" 
        onClick={handleShow}
        style={{ 
          padding: `${shapes[value.shape] || 0}px`,
          width: '100%', 
          height: '50px',
          border: 'none',
          display: 'block',
        }}
      >
        <div style={{ marginTop: '5px' }}>
          <div>
            <div>Top: {paddingValues.top} Right: {paddingValues.right}</div>
            <div>Bottom: {paddingValues.bottom} Left: {paddingValues.left}</div>
          </div>
        </div>
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Elige una forma</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {Object.entries(shapes).map(([shapeKey, shapeValue], index) => (
              <div key={index} style={{textAlign: 'center', padding: '10px'}}>
                <div style={{fontSize: '10px'}}>
                  {shapeKey}
                </div>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: `${shapeValue}px`,
                    border: shapeKey === value.shape ? '2px solid blue' : '1px solid lightgray',
                  }}
                  onClick={() => handleShapeClick(shapeKey)}
                >
                  {shapeValue}
                </div>
              </div>
            ))}
          </div>
          <div>
            {Object.entries(paddingValues).map(([paddingKey, paddingValue], index) => (
              <div key={index}>
                <label>{paddingKey}</label>
                <FormControl
                  type="number"
                  value={isNaN(paddingValue) ? "" : paddingValue}
                  onChange={(event) => handlePaddingChange(paddingKey, event)}
                />
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PaddingPickerWidget;
