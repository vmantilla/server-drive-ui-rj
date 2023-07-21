import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const FontPickerWidget = (props) => {
  const { value, onChange, themesData } = props;

  const [show, setShow] = useState(false);
  const [tempValue, setTempValue] = useState(value); // Usamos un valor temporal para cambios antes de aplicar

  const handleClose = () => {
    setTempValue(value); // Reiniciamos el valor temporal al original al cerrar
    setShow(false);
  };

  const handleShow = () => setShow(true);
  const handleApply = () => {
    onChange(tempValue); // Aplicamos el cambio al valor temporal cuando se presiona el botón de aplicar
    setShow(false);
  };

  return (
    <>
      <Button 
        variant="primary" 
        onClick={handleShow} 
        style={{
          fontFamily: themesData.fonts[value]?.name ?? 'default', 
          width: '100%', 
          height: '30px', 
          border: 'none',
          display: 'block',
          borderRadius: '10px'
        }}>
          {value}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Elige una fuente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
            {Object.entries(themesData.fonts).map(([fontKey, fontValue], index) => (
              <div 
                key={index} 
                style={{
                  textAlign: 'left', 
                  padding: '10px', 
                  border: fontKey === tempValue ? '2px solid blue' : 'none',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
                onClick={() => setTempValue(fontKey)}
              >
                <div style={{
                  fontSize: `${fontValue.size}px`,
                  lineHeight: `${fontValue.lineHeight}px`,
                  letterSpacing: `${fontValue.letterSpacing}px`,
                  fontWeight: fontValue.weight,
                  fontFamily: fontValue.name
                }}>
                  {fontKey}
                </div>
                <div style={{fontSize: '10px', marginTop: '15px'}}>
                  size: {fontValue.size}px, 
                  line-height: {fontValue.lineHeight}px, 
                  letter-spacing: {fontValue.letterSpacing}px, 
                  weight: {fontValue.weight}
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Aplicar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FontPickerWidget;
