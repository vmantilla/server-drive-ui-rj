// schemas.js

export const genericSchema = {
  type: "object",
  properties: {
    color: { type: "string" },
    shape: { type: "string" },
    font: { type: "string" },
    alignment: { type: "string" },
    padding: { type: "number" },
    content: { type: "string" },
    isEnabled: { type: "boolean" },
  },
};

export const textSchema = {
  type: "object",
  properties: {
    text: { type: "string" },
    color: { type: "string" },
    font: { type: "string" },
    alignment: { type: "string" },
  },
};

export const buttonSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    color: { type: "string" },
    isEnabled: { type: "boolean" },
    padding: { 
      type: "object",
      properties: {
        top: { type: "number" },
        bottom: { type: "number" },
        left: { type: "number" },
        right: { type: "number" },
      },
      required: ['top', 'bottom', 'left', 'right'],  // Agrega esto si todas las propiedades son necesarias
    }
  },
};

export const imageSchema = {
  type: "object",
  properties: {
    source: { type: "string" },
    resizeMode: { type: "string" },
  },
};

export const textFieldSchema = {
  type: "object",
  properties: {
    placeholder: { type: "string" },
    text: { type: "string" },
    keyboardType: { type: "string" },
  },
};

export const scrollViewSchema = {
  type: "object",
  properties: {
    contentContainerStyle: { type: "string" },
  },
};
