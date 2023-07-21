import React, { useState, useEffect } from "react";
import { Modal, Button, FormControl } from "react-bootstrap";

const FramePickerWidget = (props) => {
  const { onChange } = props;
  const value = props.value || { width: null, height: null };

  const [widthValue, setWidthValue] = useState(value.width);
  const [heightValue, setHeightValue] = useState(value.height);

  const [customWidthMode, setCustomWidthMode] = useState("fixed");
  const [customWidthMin, setCustomWidthMin] = useState("");
  const [customWidthMax, setCustomWidthMax] = useState("");
  const [customHeightMode, setCustomHeightMode] = useState("fixed");
  const [customHeightMin, setCustomHeightMin] = useState("");
  const [customHeightMax, setCustomHeightMax] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

	useEffect(() => {
  if (value.width && typeof value.width === "string" && /^\d+$/.test(value.width)) {
    setWidthValue('custom');
    setCustomWidthMin(value.width);
    setCustomWidthMax("");
    setCustomWidthMode('fixed');
  } else if (value.width && typeof value.width === "object" && value.width.min && value.width.max) {
    setWidthValue('custom');
    setCustomWidthMin(value.width?.min);
    setCustomWidthMax(value.width?.max);
    setCustomWidthMode('range');
  } else {
    setWidthValue(value.width);
  }

  if (value.height && typeof value.height === "string" && /^\d+$/.test(value.height)) {
    setHeightValue('custom');
    setCustomHeightMin(value.height);
    setCustomHeightMax("");
    setCustomHeightMode('fixed');
  } else if (value.height && typeof value.height === "object" && value.height.min && value.height.max) {
    setHeightValue('custom');
    setCustomHeightMin(value.height?.min);
    setCustomHeightMax(value.height?.max);
    setCustomHeightMode('range');
  } else {
    setHeightValue(value.height);
  }
}, [value.width, value.height]);



  const handleWidthClick = (width) => {
    setWidthValue(width);
    if (width !== "custom") {
      setCustomWidthMode("fixed");
      setCustomWidthMin("");
      setCustomWidthMax("");
    }
  };

  const handleHeightClick = (height) => {
    setHeightValue(height);
    if (height !== "custom") {
      setCustomHeightMode("fixed");
      setCustomHeightMin("");
      setCustomHeightMax("");
    }
  };

  const handleApplyFrameOptions = () => {
    const updatedFrameOptions = {
      width: widthValue === "custom" ? getCustomWidthValue() : widthValue,
      height: heightValue === "custom" ? getCustomHeightValue() : heightValue
    };
    onChange(updatedFrameOptions);
    handleClose();
  };

  const getCustomWidthValue = () => {
    if (customWidthMode === "fixed") {
      return customWidthMin !== "" ? customWidthMin : null;
    } else if (customWidthMode === "range") {
      return {
        min: customWidthMin !== "" ? customWidthMin : null,
        max: customWidthMax !== "" ? customWidthMax : null
      };
    }
    return null;
  };

  const getCustomHeightValue = () => {
    if (customHeightMode === "fixed") {
      return customHeightMin !== "" ? customHeightMin : null;
    } else if (customHeightMode === "range") {
      return {
        min: customHeightMin !== "" ? customHeightMin : null,
        max: customHeightMax !== "" ? customHeightMax : null
      };
    }
    return null;
  };

  const handleCustomWidthModeChange = (event) => {
    setCustomWidthMode(event.target.value);
  };

  const handleCustomHeightModeChange = (event) => {
    setCustomHeightMode(event.target.value);
  };

  return (
    <>
      <Button variant="primary" 
          onClick={handleShow} style={{
          width: '100%', 
          height: '50px', 
          border: 'none',
          display: 'block',
          borderRadius: '10px' // Un borde de radio pequeño para el botón
        }} >
        Set Frame
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Frame Picker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", justifyContent: "center", margin: "auto" }}>
  
            {/* Width options */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: '0px',
                  border: widthValue === '100%' ? '2px solid blue' : '1px solid lightgray',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => handleWidthClick('100%')}
              >
                Full Width
              </div>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: '0px',
                  border: widthValue === 'auto' ? '2px solid blue' : '1px solid lightgray',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => handleWidthClick('auto')}
              >
                Auto Width
              </div>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: '0px',
                  border: widthValue === 'custom' ? '2px solid blue' : '1px solid lightgray',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => handleWidthClick('custom')}
              >
                Custom Width
              </div>
            </div>

            {/* Height options */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: '0px',
                  border: heightValue === '100%' ? '2px solid blue' : '1px solid lightgray',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => handleHeightClick('100%')}
              >
                Full Height
              </div>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: '0px',
                  border: heightValue === 'auto' ? '2px solid blue' : '1px solid lightgray',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => handleHeightClick('auto')}
              >
                Auto Height
              </div>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: '0px',
                  border: heightValue === 'custom' ? '2px solid blue' : '1px solid lightgray',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => handleHeightClick('custom')}
              >
                Custom Height
              </div>
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            {widthValue === 'custom' && (
              <div>
                <label>Custom Width:</label>
                <div>
                  <input
                    type="radio"
                    id="fixedWidth"
                    name="customWidthMode"
                    value="fixed"
                    checked={customWidthMode === "fixed"}
                    onChange={handleCustomWidthModeChange}
                  />
                  <label htmlFor="fixedWidth">Fixed</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="rangeWidth"
                    name="customWidthMode"
                    value="range"
                    checked={customWidthMode === "range"}
                    onChange={handleCustomWidthModeChange}
                  />
                  <label htmlFor="rangeWidth">Range</label>
                </div>
                {customWidthMode === "fixed" && (
                  <FormControl
                    type="number"
                    value={customWidthMin}
                    onChange={(event) => setCustomWidthMin(event.target.value)}
                    placeholder="Fixed Width"
                  />
                )}
                {customWidthMode === "range" && (
                  <>
                    <FormControl
                      type="number"
                      value={customWidthMin}
                      onChange={(event) => setCustomWidthMin(event.target.value)}
                      placeholder="Min Width"
                    />
                    <FormControl
                      type="number"
                      value={customWidthMax}
                      onChange={(event) => setCustomWidthMax(event.target.value)}
                      placeholder="Max Width"
                    />
                  </>
                )}
              </div>
            )}
            {heightValue === 'custom' && (
              <div>
                <label>Custom Height:</label>
                <div>
                  <input
                    type="radio"
                    id="fixedHeight"
                    name="customHeightMode"
                    value="fixed"
                    checked={customHeightMode === "fixed"}
                    onChange={handleCustomHeightModeChange}
                  />
                  <label htmlFor="fixedHeight">Fixed</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="rangeHeight"
                    name="customHeightMode"
                    value="range"
                    checked={customHeightMode === "range"}
                    onChange={handleCustomHeightModeChange}
                  />
                  <label htmlFor="rangeHeight">Range</label>
                </div>
                {customHeightMode === "fixed" && (
                  <FormControl
                    type="number"
                    value={customHeightMin}
                    onChange={(event) => setCustomHeightMin(event.target.value)}
                    placeholder="Fixed Height"
                  />
                )}
                {customHeightMode === "range" && (
                  <>
                    <FormControl
                      type="number"
                      value={customHeightMin}
                      onChange={(event) => setCustomHeightMin(event.target.value)}
                      placeholder="Min Height"
                    />
                    <FormControl
                      type="number"
                      value={customHeightMax}
                      onChange={(event) => setCustomHeightMax(event.target.value)}
                      placeholder="Max Height"
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleApplyFrameOptions}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FramePickerWidget;
