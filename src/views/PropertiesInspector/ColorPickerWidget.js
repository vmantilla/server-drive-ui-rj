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
          width: '100%',  // Ocupa todo el ancho
          height: '30px', 
          border: '1px solid black',  // Borde negro de 1px
          display: 'block',
          borderRadius: '10px', 
          padding: '4px'  
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
                    width: "80px",
                    height: "80px",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '10px', // Un borde de radio pequeño para cada muestra de color
                    backgroundColor: colorValue.value,
                    border: colorKey === value ? '2px solid blue' : '1px solid lightgray',
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
