import React, { useState } from "react";
import { Modal, Button, FormControl } from "react-bootstrap";

const PaddingPickerWidget = (props) => {
  const { onChange } = props;
  const value = props.value || { top: 0, bottom: 0, left: 0, right: 0 };

  const [paddingValues, setPaddingValues] = useState(value);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handlePaddingChange = (direction, event) => {
    const newValue = parseInt(event.target.value);
    setPaddingValues(prevPaddingValues => ({
      ...prevPaddingValues,
      [direction]: isNaN(newValue) ? 0 : newValue
    }));
  };

  const handleApplyPadding = () => {
    onChange(paddingValues);
    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Set Padding
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Padding Picker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>
              Top:
              <FormControl
                type="number"
                value={paddingValues.top}
                onChange={(event) => handlePaddingChange('top', event)}
              />
            </label>
          </div>
          <div>
            <label>
              Bottom:
              <FormControl
                type="number"
                value={paddingValues.bottom}
                onChange={(event) => handlePaddingChange('bottom', event)}
              />
            </label>
          </div>
          <div>
            <label>
              Left:
              <FormControl
                type="number"
                value={paddingValues.left}
                onChange={(event) => handlePaddingChange('left', event)}
              />
            </label>
          </div>
          <div>
            <label>
              Right:
              <FormControl
                type="number"
                value={paddingValues.right}
                onChange={(event) => handlePaddingChange('right', event)}
              />
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleApplyPadding}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PaddingPickerWidget;
