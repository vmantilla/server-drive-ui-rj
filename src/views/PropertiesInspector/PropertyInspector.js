// PropertyInspector.js

import React, { useState, useEffect } from 'react';
import Form from "@rjsf/core";
import { genericSchema, textSchema, buttonSchema, imageSchema, textFieldSchema, scrollViewSchema, vstackSchema, hstackSchema, spaceSchema, objectSchema, containerViewSchema } from './schemas';

import Ajv from "ajv";
import addFormats from "ajv-formats";

import '../../css/PropertyInspectorStyles.css'; 
import ColorPickerWidget from "./ColorPickerWidget";
import RadiusPickerWidget from "./RadiusPickerWidget";
import PaddingPickerWidget from "./PaddingPickerWidget";
import FramePickerWidget from "./FramePickerWidget";


const ajv = new Ajv({ allErrors: true, useDefaults: true });
addFormats(ajv);

const PropertyInspector = ({ themesData, component = {}, droppedComponents, setDroppedComponents }) => {

  const [formData, setFormData] = useState({});

  const CustomColorPickerWidget = (props) => {
  return <ColorPickerWidget {...props} themesData={themesData} />;
};

  const getSchema = (componentType) => {
    switch (componentType) {
      case "Text":
        return textSchema;
      case "Button":
        return genericSchema;
      case "Image":
        return imageSchema;
      case "TextField":
        return textFieldSchema;
      case "ScrollView":
        return scrollViewSchema;
      case "VStack":
        return vstackSchema;
      case "HStack":
        return hstackSchema;
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
    font: { "ui:widget": "select", "ui:options": { enumOptions: ["Arial", "Verdana", "Helvetica", "Times New Roman"] } },
    // Agrega todos los demás widgets de UI que son comunes
  };



  const getUiSchema = (componentType) => {
    console.log("getUiSchema = (componentType)", componentType);
  switch (componentType) {
    case "Text":
      return {
        ...genericUiSchema,
        text: { "ui:widget": "textarea" },
        color: { "ui:widget": "color" },
        alignment: { "ui:widget": "radio", "ui:options": { inline: true } },
      };
    case "Button":
      return {
        ...genericUiSchema,
        title: { "ui:widget": "text" },
      };
    case "Object":
      return {
        ...genericUiSchema,
        title: { "ui:widget": "text" },
      };
    case "VStack":
      return {
        ...genericUiSchema
      };
    case "HStack":
      return {
        ...genericUiSchema
      };
    case "Image":
      return {
        ...genericUiSchema,
        source: { "ui:widget": "text" },
        resizeMode: { "ui:widget": "select", "ui:options": { enumOptions: ["cover", "contain", "stretch", "repeat", "center"] } },
      };
    case "TextField":
      return {
        ...genericUiSchema,
        placeholder: { "ui:widget": "text" },
        keyboardType: { "ui:widget": "select", "ui:options": { enumOptions: ["default", "number-pad", "decimal-pad", "numeric", "email-address", "phone-pad"] } },
      };
    case "ContainerView":
      return {
        ...genericUiSchema,
        title: { "ui:widget": "text" },
      };
    case "ScrollView":
      return {
        ...genericUiSchema,
        contentContainerStyle: { "ui:widget": "textarea" },
      };
    default:
      return {};
  }
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
      validator={ajv.validate}
      showErrorList={false}
      noHtml5Validate={true}
      widgets={{ 
        ColorPickerWidget: CustomColorPickerWidget,
        RadiusPickerWidget: RadiusPickerWidget,
        PaddingPickerWidget: PaddingPickerWidget,
        FramePickerWidget: FramePickerWidget  }}
      SubmitButton={CustomSubmitButton}
    />
  );
};

export default PropertyInspector;
