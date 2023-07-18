// PropertyInspector.js

import React, { useState, useEffect } from 'react';
import Form from "@rjsf/core";

import Ajv from "ajv";
import addFormats from "ajv-formats";
import { spaceSchema, objectSchema, containerViewSchema } from './schemas';

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

  const CustomColorPickerWidget = (props) => {
  return <ColorPickerWidget {...props} themesData={themesData} />;
};

const CustomFontPickerWidget = (props) => {
  return <FontPickerWidget {...props} themesData={themesData} />;
};


  const getSchema = (componentType) => {

    console.log("objectSchema", objectSchema);
    
    switch (componentType) {
      case "Space":
        return spaceSchema;
      case "Object":
        return objectSchema;
      case "ContainerView":
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
    console.log("genericUiSchema", genericUiSchema);
    return genericUiSchema;
};



  useEffect(() => {
    setFormData(component.properties);
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


  // Si component.properties es undefined o null, utiliza un objeto vacío
  const properties = component?.properties || {};

  const CustomSubmitButton = () => {
    return <></>;
  };

  return (
    <Form
      schema={getSchema(component.type)}
      uiSchema={getUiSchema(component.type)}
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
