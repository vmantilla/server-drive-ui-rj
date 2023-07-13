import React, { useState } from "react";
import { Modal, Button, FormControl } from "react-bootstrap";

const shapes = {
  none: 0,
  extraSmall: 5,
  small: 10,
  medium: 20,
  large: 30,
  extraLarge: 40,
  full: 50, // Changed to 50% of the frame
  custom: 'custom'
};

const RadiusPickerWidget = (props) => {
  const { onChange, themesData } = props;
  const value = props.value || { shape: 'none' }; 

  const initialCorners = value.corners || {
    topStart: 0,
    topEnd: 0,
    bottomStart: 0,
    bottomEnd: 0
  };

  const [cornerValues, setCornerValues] = useState(initialCorners);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleShapeClick = (shapeKey) => {
    if (shapeKey === 'none') {
      // Aquí es donde manejamos el caso 'none'.
      // En lugar de pasar un objeto a onChange, pasamos undefined.
      // Esto efectivamente eliminará la propiedad cornerRadius.
      onChange(undefined);
    } else if (shapeKey === 'custom') {
      setCornerValues({
        topStart: 0,
        topEnd: 0,
        bottomStart: 0,
        bottomEnd: 0
      });
      onChange({ shape: shapeKey, corners: cornerValues });
    } else {
      onChange({ shape: shapeKey });
    }
  };

  const handleCornerChange = (cornerKey, event) => {
    const newCornerValues = {
      ...cornerValues,
      [cornerKey]: isNaN(event.target.value) ? "" : parseInt(event.target.value)
    };
    setCornerValues(newCornerValues);
    onChange({ shape: value.shape, corners: newCornerValues });
  };

  console.log(themesData);

  return (
    <>
      <Button 
  variant="primary" 
  onClick={handleShow}
  style={{ 
    borderRadius: `${shapes[value.shape] || 0}px`,
    width: '100px',
    height: '50px',
    border: 'none',
    display: 'inline-block'
  }}
>
  <div style={{ marginTop: '5px' }}>
    {value.shape === 'custom'
      ? (
        <div>
          <div>Custom</div>
          <div>TS: {cornerValues.topStart} TE: {cornerValues.topEnd}</div>
          <div>BS: {cornerValues.bottomStart} BE: {cornerValues.bottomEnd}</div>
        </div>
      )
      : value.shape === 'none'
        ? 'None'
        : `${value.shape}: ${shapes[value.shape]}`
    }
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
                  {shapeKey} {/* El nombre de la forma está ubicado encima de cada cuadro */}
                </div>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: shapeKey !== 'custom' ? `${shapeValue}px` : '0px',
                    border: shapeKey === value.shape ? '2px solid blue' : '1px solid lightgray',
                  }}
                  onClick={() => handleShapeClick(shapeKey)}
                >
                  {shapeKey !== 'custom' ? shapeValue : 'custom'}
                </div>
              </div>
            ))}
          </div>
          {value.shape === 'custom' &&
            <div>
              {Object.entries(cornerValues).map(([cornerKey, cornerValue], index) => (
                <div key={index}>
                  <label>{cornerKey}</label>
                  <FormControl
                    type="number"
                    value={isNaN(cornerValue) ? "" : cornerValue}
                    onChange={(event) => handleCornerChange(cornerKey, event)}
                  />
                </div>
              ))}
            </div>
          }
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

export default RadiusPickerWidget;
