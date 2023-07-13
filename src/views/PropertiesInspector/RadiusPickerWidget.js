import React, { useState } from "react";
import { Modal, Button, FormControl } from "react-bootstrap";

const shapes = {
  none: 0,
  extraSmall: 5,
  small: 10,
  medium: 20,
  large: 30,
  extraLarge: 40,
  full: 50 // Lo tengo que dejar con un valor estático, ya que no tenemos la altura del componente
};

const RadiusPickerWidget = (props) => {
  const { value, onChange, themesData } = props;

  // Inicializamos cornerValues en base al valor actual de props.value
  const [cornerValues, setCornerValues] = useState(value.corners || {
    topStart: 0,
    topEnd: 0,
    bottomEnd: 0
  });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleShapeClick = (shapeKey) => {
    // Pasamos el nuevo valor de cornerRadius a onChange
    onChange({ shape: shapeKey, corners: cornerValues });
    handleClose();
  };

  const handleCornerChange = (cornerKey, event) => {
    const newCornerValues = {
      ...cornerValues,
      [cornerKey]: parseInt(event.target.value)
    };
    setCornerValues(newCornerValues);

    // Pasamos el nuevo valor de cornerRadius a onChange
    onChange({ shape: value.shape, corners: newCornerValues });
  };

  console.log(themesData);

  return (
    <>
      <Button 
        variant="primary" 
        onClick={handleShow}
        style={{ 
          borderRadius: `${shapes[value.shape]}px`,
          width: '50px', 
          height: '30px', 
          border: 'none',
          display: 'inline-block'
        }}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Elige una forma</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {Object.entries(shapes).map(([shapeKey, shapeValue], index) => (
              <div key={index} style={{textAlign: 'left', padding: '10px'}}>
                <div style={{fontSize: '10px'}}>
                  {shapeKey} {/* El nombre de la forma está ubicado encima de cada cuadro */}
                </div>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: `${shapeValue}px`,
                    border: '1px solid lightgray',
                  }}
                  onClick={() => handleShapeClick(shapeKey)}
                ></div>
              </div>
            ))}
          </div>
          <div>
            {Object.entries(cornerValues).map(([cornerKey, cornerValue], index) => (
			  <div key={index}>
			    <label>{cornerKey}</label>
			    <FormControl
			      type="number"
			      value={cornerValue}
			      onChange={(event) => handleCornerChange(cornerKey, event)}
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

export default RadiusPickerWidget;
