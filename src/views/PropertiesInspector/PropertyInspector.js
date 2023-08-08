import React from 'react';
import Form from "@rjsf/core";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { spaceSchema, objectSchema, containerViewSchema, EmptyViewSchema, ButtonViewSchema, TextViewSchema, ImageViewSchema} from './schemas';
import '../../css/PropertyInspectorStyles.css'; 
import ColorPickerWidget from "./ColorPickerWidget";
import RadiusPickerWidget from "./RadiusPickerWidget";
import MarginPickerWidget from "./MarginPickerWidget";
import FramePickerWidget from "./FramePickerWidget";
import FontPickerWidget from "./FontPickerWidget";


const ajv = new Ajv({ allErrors: true, useDefaults: true });
addFormats(ajv);

const PropertyInspector = ({ themesData, component, updateComponent, handleDeleteComponent }) => {

  const CustomColorPickerWidget = (props) => {
    if (!themesData) { return null; };
    return <ColorPickerWidget {...props} themesData={themesData} />;
  };

  const CustomFontPickerWidget = (props) => {
    if (!themesData) { return null; };
    return <FontPickerWidget {...props} themesData={themesData} />;
  };

    const FileWidget = (props) => {
    const { onChange } = props;
    const processFile = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    };

    return <input type="file" onChange={processFile} />;
  };

  const getSchema = (component_type) => {
    switch (component_type) {
      case "Space":
        return spaceSchema;
      case "Button":
        return ButtonViewSchema;
      case "Text":
        return TextViewSchema;
      case "Image":
        return ImageViewSchema;
      case "EmptyView":
        return EmptyViewSchema;
      case "Row":
        return containerViewSchema;
      case "Column":
        return containerViewSchema;
      case "Overflow":
        return containerViewSchema;
      default:
        return {};
    }
  };

  const genericUiSchema = {
    frame: { "ui:widget": "FramePickerWidget" },
    backgroundColor: { "ui:widget": "ColorPickerWidget" },
    border: { 
      color: { "ui:widget": "ColorPickerWidget" }, 
      width: { "ui:widget": "updown" } 
    },
    cornerRadius: { "ui:widget": "RadiusPickerWidget" },
    margin: { "ui:widget": "MarginPickerWidget" },
    font: {
      font: { "ui:widget": "FontPickerWidget" },
      color: { "ui:widget": "ColorPickerWidget" }
    },
    source: {
      src: { "ui:widget": "file" },
      origin: { "ui:widget": "select" }
    },
    clickProperties: { // Widgets para las propiedades de clic
      isClickable: { "ui:widget": "checkbox" },
      onClickAction: { "ui:widget": "textarea" },
    },
};



  const getUiSchema = (component_type) => {
    return genericUiSchema;
  };

  const handleOnChange = ({ formData }) => {
    updateComponent(component.id, formData);
  };

  const validate = (formData, schema) => {
    const valid = ajv.validate(schema, formData);
    const errors = ajv.errors;
    return { valid, errors };
  };

  validate.isValid = (formData, schema) => {
    return true;
  };

  const CustomSubmitButton = () => {
    return <></>;
  };

  return (
    <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
    <button 
        onClick={ () => handleDeleteComponent(component.id)}
        style={{
          height: "40px", 
          borderRadius: "0%", 
          backgroundColor: "#ff0000", 
          color: "white",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Eliminar componente
      </button>
      <Form
        schema={getSchema(component?.properties?.component_type || {})}
        uiSchema={getUiSchema(component?.properties?.component_type || {})}
        formData={component.properties}
        onChange={handleOnChange}
        validator={validate}
        showErrorList={false}
        noHtml5Validate={true}
        widgets={{ 
          ColorPickerWidget: CustomColorPickerWidget,
          RadiusPickerWidget: RadiusPickerWidget,
          MarginPickerWidget: MarginPickerWidget,
          FramePickerWidget: FramePickerWidget,
          FontPickerWidget: CustomFontPickerWidget,
          file: FileWidget 
        }}
        SubmitButton={CustomSubmitButton}
      />
      
    </div>
  );
};

export default PropertyInspector;
