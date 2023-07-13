// PropertyInspector.js

import React, { useState, useEffect } from 'react';
import Form from "@rjsf/core";
import { genericSchema, textSchema, buttonSchema, imageSchema, textFieldSchema, scrollViewSchema } from './schemas';

import Ajv from "ajv";
import addFormats from "ajv-formats";

import '../../css/PropertyInspectorStyles.css'; 


const ajv = new Ajv({ allErrors: true, useDefaults: true });
addFormats(ajv);

const PropertyInspector = ({ component = {} }) => {

  const [formData, setFormData] = useState({});

  const getSchema = (componentType) => {
    switch (componentType) {
      case "Text":
        return textSchema;
      case "Button":
        return buttonSchema;
      case "Image":
        return imageSchema;
      case "TextField":
        return textFieldSchema;
      case "ScrollView":
        return scrollViewSchema;
      default:
        return {};
    }
  };

  const getUiSchema = (componentType) => {
  switch (componentType) {
    case "Text":
      return {
        text: { "ui:widget": "textarea" },
        color: { "ui:widget": "color" },
        font: { "ui:widget": "select", "ui:options": { enumOptions: ["Arial", "Verdana", "Helvetica", "Times New Roman"] } },
        alignment: { "ui:widget": "radio", "ui:options": { inline: true } },
      };
    case "Button":
  return {
    title: { "ui:widget": "text" },
    color: { "ui:widget": "color" },
    isEnabled: { "ui:widget": "checkbox" },
    padding: {
      "ui:field": "layout",
      "ui:layout": [
        { top: { "ui:widget": "updown", "classNames": "my-custom-class top" } },
        { bottom: { "ui:widget": "updown", "classNames": "my-custom-class bottom" } },
        { left: { "ui:widget": "updown", "classNames": "my-custom-class left" } },
        { right: { "ui:widget": "updown", "classNames": "my-custom-class right" } },
      ],
    },
  };


    case "Image":
      return {
        source: { "ui:widget": "text" },
        resizeMode: { "ui:widget": "select", "ui:options": { enumOptions: ["cover", "contain", "stretch", "repeat", "center"] } },
      };
    case "TextField":
      return {
        placeholder: { "ui:widget": "text" },
        text: { "ui:widget": "text" },
        keyboardType: { "ui:widget": "select", "ui:options": { enumOptions: ["default", "number-pad", "decimal-pad", "numeric", "email-address", "phone-pad"] } },
      };
    case "ScrollView":
      return {
        contentContainerStyle: { "ui:widget": "textarea" },
      };
    default:
      return {};
  }
};


  useEffect(() => {
    setFormData(component);
  }, [component]);

  const handleOnChange = ({ formData }) => {
    setFormData(formData);
  };

  // Si component.properties es undefined o null, utiliza un objeto vacío
  const properties = component?.properties || {};

  return (
    <Form
      schema={getSchema(component.type)}
      uiSchema={getUiSchema(component.type)}
      formData={formData}
      onChange={handleOnChange}
      validator={ajv.validate}
    />
  );
};

export default PropertyInspector;
