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



export const objectSchema = {
  properties: {
    componentType: { 
      type: "string", 
      enum: ["EmptyView", "Button", "Image", "Text", "TextField", "Space"],
      default: "EmptyView"
    },
  },
  required: [], // puedes definir las propiedades requeridas aquí.
};

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
    margin: { type: "string" },
  },
  required: [], // puedes definir las propiedades requeridas aquí.
};

export const containerViewSchema = {
  ...genericSchema,
  properties: {
    componentType: { 
      type: "string", 
      enum: ["Column", "Row", "Overflow"],
      default: "Row"
    },
    spacing: { type: "number" },
    ...genericSchema.properties,
  },
  required: [], // puedes definir las propiedades requeridas aquí.
};

export const spaceSchema = {
  ...objectSchema,
  properties: {
    ...objectSchema.properties,
    frame: { type: "string"},
  },
};


export const EmptyViewSchema = {
  ...genericSchema,
  properties: {
    componentType: { 
      type: "string", 
      enum: ["EmptyView", "Button", "Image", "Text", "TextField", "Space"],
      default: "Button"
    },
    ...genericSchema.properties,
  },
  required: [], // puedes definir las propiedades requeridas aquí.
};

export const ButtonViewSchema = {
  ...genericSchema,
  properties: {
    componentType: { 
      type: "string", 
      enum: ["EmptyView", "Button", "Image", "Text", "TextField", "Space"],
      default: "Button"
    },
    text: { type: "string" },
    action: { type: "string" },
    ...genericSchema.properties,
  },
  required: [], // puedes definir las propiedades requeridas aquí.
};

export const TextViewSchema = {
  ...genericSchema,
  properties: {
    componentType: { 
      type: "string", 
      enum: ["EmptyView", "Button", "Image", "Text", "TextField", "Space"],
      default: "Button"
    },
    text: { type: "string" },
    font: { 
      type: "object",
      properties: {
        font: { type: "string" },
        color: { type: "string" },
      },
    },
    ...genericSchema.properties,
  },
  required: [], // puedes definir las propiedades requeridas aquí.
};

export const ImageViewSchema = {
  ...genericSchema,
  properties: {
    componentType: { 
      type: "string", 
      enum: ["EmptyView", "Button", "Image", "Text", "TextField", "Space"],
      default: "Button"
    },
    src: { type: "string", default: "default.png" },
    origin: { type: "string", enum: ["Url", "Assets", "System"], default: "Assets" },
    ...genericSchema.properties,
  },
  required: [], // puedes definir las propiedades requeridas aquí.
};













