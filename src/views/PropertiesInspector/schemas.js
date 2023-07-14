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

export const vstackSchema = {
  ...genericSchema,
  properties: {
    ...genericSchema.properties,
  },
};

export const hstackSchema = {
  ...genericSchema,
  properties: {
    ...genericSchema.properties,
  },
};


export const textSchema = {
  ...genericSchema,
  properties: {
    ...genericSchema.properties,
    color: { type: "string" },
    alignment: { type: "string" },
  },
};

export const buttonSchema = {
  ...genericSchema,
  properties: {
    ...genericSchema.properties,
  },
};

export const imageSchema = {
  ...genericSchema,
  properties: {
    ...genericSchema.properties,
    resizeMode: { type: "string" },
  },
};

export const textFieldSchema = {
  ...genericSchema,
  properties: {
    ...genericSchema.properties,
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
