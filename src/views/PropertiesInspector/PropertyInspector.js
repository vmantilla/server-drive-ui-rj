import React from 'react';
import Form from "@rjsf/core";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { spaceSchema, objectSchema, containerViewSchema, EmptyViewSchema, ButtonViewSchema} from './schemas';
import '../../css/PropertyInspectorStyles.css'; 
import ColorPickerWidget from "./ColorPickerWidget";
import RadiusPickerWidget from "./RadiusPickerWidget";
import PaddingPickerWidget from "./PaddingPickerWidget";
import FramePickerWidget from "./FramePickerWidget";
import FontPickerWidget from "./FontPickerWidget";

const ajv = new Ajv({ allErrors: true, useDefaults: true });
addFormats(ajv);

const PropertyInspector = ({ themesData, component, updateComponent, deleteComponent }) => {

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este componente?")) {
      deleteComponent(component.id);
    }
  };

  const CustomColorPickerWidget = (props) => {
    if (!themesData) { return null; };
    return <ColorPickerWidget {...props} themesData={themesData} />;
  };

  const CustomFontPickerWidget = (props) => {
    if (!themesData) { return null; };
    return <FontPickerWidget {...props} themesData={themesData} />;
  };

  const getSchema = (componentType) => {
    switch (componentType) {
      case "Space":
        return spaceSchema;
      case "Button":
        return ButtonViewSchema;
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
    padding: { "ui:widget": "PaddingPickerWidget" },
    font: {
      font: { "ui:widget": "FontPickerWidget" },
      color: { "ui:widget": "ColorPickerWidget" }
    },
  };

  const getUiSchema = (componentType) => {
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
    <div>
      <Form
        schema={getSchema(component?.properties?.componentType || {})}
        uiSchema={getUiSchema(component?.properties?.componentType || {})}
        formData={component.properties}
        onChange={handleOnChange}
        validator={validate}
        showErrorList={false}
        noHtml5Validate={true}
        widgets={{ 
          ColorPickerWidget: CustomColorPickerWidget,
          RadiusPickerWidget: RadiusPickerWidget,
          PaddingPickerWidget: PaddingPickerWidget,
          FramePickerWidget: FramePickerWidget,
          FontPickerWidget: CustomFontPickerWidget 
        }}
        SubmitButton={CustomSubmitButton}
      />
      <button 
        onClick={handleDelete}
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
    </div>
  );
};

export default PropertyInspector;
