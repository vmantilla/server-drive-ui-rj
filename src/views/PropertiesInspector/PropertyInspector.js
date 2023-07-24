// PropertyInspector.js

import React, { useState, useEffect } from 'react';
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

const PropertyInspector = ({ themesData, component = {}, droppedComponents, setDroppedComponents }) => {

  const [formData, setFormData] = useState({});
  const [keyValue, setKeyValue] = useState(0);

  const CustomColorPickerWidget = (props) => {
    if (!themesData) { return null; };
  return <ColorPickerWidget {...props} themesData={themesData} />;
};

const CustomFontPickerWidget = (props) => {
  if (!themesData) { return null; };
  return <FontPickerWidget {...props} themesData={themesData} />;
};


  const getSchema = (componentType) => {

//    console.log("objectSchema", objectSchema);
    
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
    },// Agrega todos los demás widgets de UI que son comunes
  };



  const getUiSchema = (componentType) => {
//    console.log("genericUiSchema", genericUiSchema);
    return genericUiSchema;
};



  useEffect(() => {
    setFormData(component.properties);
    console.log("component.properties", component.properties);
  }, [component]);

const updateNestedComponent = (components, targetId, newProperties) => {
  return components.map(component => {
    if (component.id === targetId) {
      // actualizamos las propiedades de este componente
      return { ...component, properties: newProperties };
    } else if (component.childrens) {
      // aplicamos la función de manera recursiva a los hijos del componente
      return { ...component, childrens: updateNestedComponent(component.childrens, targetId, newProperties) };
    } else {
      // si este componente no es el que estamos buscando y no tiene hijos, lo dejamos tal cual
      return component;
    }
  });
};

const handleOnChange = ({ formData }) => {
  if (Array.isArray(droppedComponents)) {
    const newDroppedComponents = updateNestedComponent(droppedComponents, component.id, formData);

    console.log("updated", newDroppedComponents);
    setDroppedComponents(newDroppedComponents);
    setKeyValue((prevValue) => prevValue + 1);
    setFormData(formData);

    
  } else {
    // handle the case where droppedComponents is not an array
  }
};

const validate = (formData, schema) => {
  const valid = ajv.validate(schema, formData);
  const errors = ajv.errors;
  return { valid, errors };
};

validate.isValid = (formData, schema) => {
  return true
};


  const CustomSubmitButton = () => {
    return <></>;
  };

  return (
    <Form
      key={keyValue} 
      schema={getSchema(component?.properties?.componentType || {})}
      uiSchema={getUiSchema(component?.properties?.componentType || {})}
      formData={formData}
      onChange={handleOnChange}
      validator={validate}
      showErrorList={false}
      noHtml5Validate={true}
      widgets={{ 
        ColorPickerWidget: CustomColorPickerWidget,
        RadiusPickerWidget: RadiusPickerWidget,
        PaddingPickerWidget: PaddingPickerWidget,
        FramePickerWidget: FramePickerWidget ,
        FontPickerWidget: CustomFontPickerWidget }}
      SubmitButton={CustomSubmitButton}
    />
  );
};

export default PropertyInspector;
