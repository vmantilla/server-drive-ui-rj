// PropertyInspector.js

import React, { useState, useEffect } from 'react';
import Form from "@rjsf/core";
import { genericSchema, textSchema, buttonSchema, imageSchema, textFieldSchema, scrollViewSchema, vstackSchema, hstackSchema } from './schemas';

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

const handleOnChange = ({ formData }) => {
  if (Array.isArray(droppedComponents)) {
    let updated = false;
    const newDroppedComponents = droppedComponents.map(c => {
      if (c.id === component.id && JSON.stringify(c.properties) !== JSON.stringify(formData)) {
        updated = true;
        return { ...c, properties: formData };
      } 
      return c;
    });

    if (updated) {
      console.log("updated", newDroppedComponents);
      setDroppedComponents(newDroppedComponents);
      setFormData(formData);
    }
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
