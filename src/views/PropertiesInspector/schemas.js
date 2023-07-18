// schemas.js

/*
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
    */

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
  },
  required: [], // puedes definir las propiedades requeridas aquí.
};

export const containerViewSchema = {
  ...genericSchema,
  properties: {
    layout: { 
      type: ["string", null],
      enum: ["column", "row", "overflow", null],
      default: "row"
    },
    ...genericSchema.properties,
  },
  required: [], // puedes definir las propiedades requeridas aquí.
};

export const textSchema = {
  properties: {
    ...genericSchema.properties,
    color: { type: "string" },
    alignment: { type: "string" },
  },
};

export const buttonSchema = {
  properties: {
    ...genericSchema.properties,
  },
};

export const imageSchema = {
  properties: {
    resizeMode: { type: "string" },
  },
};

export const textFieldSchema = {
  properties: {
    placeholder: { type: "string" },
  },
};

export const spaceSchema = {
  type: "object",
  properties: {
    frame: { type: "string"},
  },
};


export const scrollViewSchema = {
  ...genericSchema,
  properties: {
    ...genericSchema.properties,
    contentContainerStyle: { type: "string" },
  },
};

export const objectSchema = {
  "type": "object",
  "properties": {
    "type": { 
      "type": ["string", "null"],
      "enum": ["EmptyView","Button", "Image", "Text", "TextField", null],
      "default": "EmptyView"
    },
    "frame": { "type": "string"},
    "backgroundColor": { "type": "string"},
    "border": {
      "type": "object",
      "properties": {
        "color": { "type": "string" },
        "width": { "type": "number" }
      }
    },
    "cornerRadius": { "type": "string" },
    "padding": { "type": "string" }
  },
  "anyOf": [
    {
      "if": {
        "properties": {
          "type": { "const": "Button" }
        }
      },
      "then": {
        "properties": {
          "buttonText": { "type": "string" },
          "buttonAction": { "type": "string" }
        },
        "required": ["buttonText", "buttonAction"]
      }
    },
    {
      "if": {
        "properties": {
          "type": { "const": "Image" }
        }
      },
      "then": {
        "properties": {
          "imageUrl": { "type": "string" }
        },
        "required": ["imageUrl"]
      }
    },
    {
      "if": {
        "properties": {
          "type": { "const": "Text" }
        }
      },
      "then": {
        "properties": {
          "textContent": { "type": "string" }
        },
        "required": ["textContent"]
      }
    },
    {
      "if": {
        "properties": {
          "type": { "const": "TextField" }
        }
      },
      "then": {
        "properties": {
          "textFieldPlaceholder": { "type": "string" }
        },
        "required": ["textFieldPlaceholder"]
      }
    },
    {
      "if": {
        "properties": {
          "type": { "const": "EmptyView" }
        }
      },
      "then": {
        "properties": {}
      }
    }
  ]
}
;





