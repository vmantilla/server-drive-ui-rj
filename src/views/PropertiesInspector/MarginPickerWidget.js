import React, { useState } from "react";
import { Modal, Button, FormControl } from "react-bootstrap";

const MarginPickerWidget = (props) => {
  const { onChange } = props;
  const value = props.value || { shape: 'none' }; 

  const shapes = {
    none: 0,
    extraSmall: 8,
    small: 12,
    medium: 16,
    large: 24,
    extraLarge: 32,
    full: 48,
  };

  const initialMargin = {
    top: shapes[value.shape],
    right: shapes[value.shape],
    bottom: shapes[value.shape],
    left: shapes[value.shape],
  };

  const [marginValues, setMarginValues] = useState(initialMargin);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleShapeClick = (shapeKey) => {
    const shapeValue = shapes[shapeKey];
    const newMarginValues = {
      top: shapeValue,
      right: shapeValue,
      bottom: shapeValue,
      left: shapeValue,
    };
    setMarginValues(newMarginValues);
    onChange(newMarginValues);
  };

  const handleMarginChange = (marginKey, event) => {
    const newMarginValues = {
      ...marginValues,
      [marginKey]: isNaN(event.target.value) ? "" : parseInt(event.target.value),
    };
    setMarginValues(newMarginValues);
    onChange(newMarginValues);
  };

  return (
    <>
      <Button 
        variant="primary" 
        onClick={handleShow}
        style={{ 
          margin: `${shapes[value.shape] || 0}px`,
          width: '100%', 
          height: '50px',
          border: 'none',
          display: 'block',
        }}
      >
        <div style={{ marginTop: '5px' }}>
          <div>
            <div>Top: {marginValues.top} Right: {marginValues.right}</div>
            <div>Bottom: {marginValues.bottom} Left: {marginValues.left}</div>
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
                    margin: `${shapeValue}px`,
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
            {Object.entries(marginValues).map(([marginKey, marginValue], index) => (
              <div key={index}>
                <label>{marginKey}</label>
                <FormControl
                  type="number"
                  value={isNaN(marginValue) ? "" : marginValue}
                  onChange={(event) => handleMarginChange(marginKey, event)}
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

export default MarginPickerWidget;
