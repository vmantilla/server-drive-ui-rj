import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#000000", "#ffffff"];

const ColorPickerWidget = (props) => {
  const { value, onChange } = props;
  
  // Estado para controlar la visibilidad de la modal
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow} style={{backgroundColor: value}}>
        Seleccionar color
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Elige un color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {colors.map((color, index) => (
              <div
                key={index}
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: color,
                  border: value === color ? "2px solid black" : "none",
                }}
                onClick={() => {
                  onChange(color);
                  handleClose();  // Cierra la modal al seleccionar un color
                }}
              ></div>
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
