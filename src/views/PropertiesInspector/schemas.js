// schemas.js

export const genericSchema = {
  type: "object",
  properties: {
    frame: { type: "string"},
    backgroundColor: { type: "string"},
    border: {
      type: "object",
      properties: {
        color: { type: "string" },
        width: { type: "number" }
      }
    },
    cornerRadius: { type: "string" },
    padding: { type: "string" },
    enablesReturnKeyAutomatically: { type: "boolean" },
    font: { type: "string" },
    contentInset: { type: "string" },
    contentMode: { type: "string" },
    horizontalAlignment: { type: "string" },
    isEnabled: { type: "boolean" },
    action: { type: "string" },
    aspectRatio: { type: "string" },
    autocapitalization: { type: "string" },
    autocorrection: { type: "string" },
    axis: { type: "string" },
    keyboardType: { type: "string" },
    onCommit: { type: "string" },
    onEditingChanged: { type: "string" },
    overlayAlignment: { type: "string" },
    placeholder: { type: "string" },
    resizable: { type: "boolean" },
    returnKeyType: { type: "string" },
    secure: { type: "boolean" },
    showsIndicators: { type: "boolean" },
    source: { type: "string" },
    spacing: { type: "string" },
    text: { type: "string" },
    textAlignment: { type: "string" },
    verticalAlignment: { type: "string" },
  },
  required: [], // puedes definir las propiedades requeridas aquí.
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
    },
    cornerRadius: { type: "string" },
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
