import React, { useState, useEffect } from "react";
import { Modal, Button, FormControl } from "react-bootstrap";

const PaddingPickerWidget = (props) => {
  const { value: propValue, onChange } = props;

  const [paddingValues, setPaddingValues] = useState(propValue);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setPaddingValues(propValue);
  }, [propValue]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handlePaddingChange = (direction, event) => {
    const newValue = parseInt(event.target.value);
    setPaddingValues((prevPaddingValues) => ({
      ...prevPaddingValues,
      [direction]: isNaN(newValue) ? 0 : newValue
    }));
  };

  const handleApplyPadding = () => {
    if (
      paddingValues.top === 0 &&
      paddingValues.bottom === 0 &&
      paddingValues.left === 0 &&
      paddingValues.right === 0
    ) {
      onChange(undefined);
    } else {
      const updatedPaddingValues = Object.keys(paddingValues).reduce((result, direction) => {
        if (paddingValues[direction] !== 0) {
          result[direction] = paddingValues[direction];
        }
        return result;
      }, {});
      onChange(updatedPaddingValues);
    }
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
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
            <strong>Preview:</strong>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "0px solid gray",
              padding: "10px"
            }}
          >
            <div
              style={{
                backgroundColor: "lightblue",
                border: "1px solid gray",
                width: "200px",
                height: "100px",
                padding: `${Math.min(paddingValues.top, 20)}px ${Math.min(paddingValues.right, 20)}px ${Math.min(
                  paddingValues.bottom,
                  20
                )}px ${Math.min(paddingValues.left, 20)}px`
              }}
            >
              <div
                style={{
                  border: "1px solid black",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  display: "flex",
                  backgroundColor: "white"
                }}
              >
                Content
              </div>
            </div>
          </div>
          <div>
            <label>
              Top:
              <FormControl
                type="number"
                value={paddingValues.top}
                onChange={(event) => handlePaddingChange("top", event)}
              />
            </label>
          </div>
          <div>
            <label>
              Bottom:
              <FormControl
                type="number"
                value={paddingValues.bottom}
                onChange={(event) => handlePaddingChange("bottom", event)}
              />
            </label>
          </div>
          <div>
            <label>
              Left:
              <FormControl
                type="number"
                value={paddingValues.left}
                onChange={(event) => handlePaddingChange("left", event)}
              />
            </label>
          </div>
          <div>
            <label>
              Right:
              <FormControl
                type="number"
                value={paddingValues.right}
                onChange={(event) => handlePaddingChange("right", event)}
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
