import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ColorPickerWidget = (props) => {
  const { value, onChange, themesData } = props;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  console.log(themesData);

  return (
    <>
      <Button 
        variant="primary" 
        onClick={handleShow} 
        style={{
          backgroundColor: themesData.colors[value]?.value ?? 'transparent', 
          width: '50px', 
          height: '30px', 
          border: 'none',
          display: 'inline-block'
        }} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Elige un color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {Object.entries(themesData.colors).map(([colorKey, colorValue], index) => (
              <div key={index} style={{textAlign: 'left', padding: '10px'}}>
                <div style={{fontSize: '10px'}}>
                  {colorKey} {/* El nombre de la key está ubicado encima de cada cuadro */}
                </div>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: colorValue.value,
                    border: '1px solid lightgray',
                  }}
                  onClick={() => {
                    onChange(colorKey);
                    handleClose();
                  }}
                ></div>
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

export default ColorPickerWidget;
