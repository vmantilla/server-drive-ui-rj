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
    type: { 
      type: "string", 
      enum: ["column", "row", "overflow"],
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
  type: "object",
  properties: {
    type: { 
      type: "string",
      enum: ["EmptyView", "Button", "Image", "Text", "TextField"],
      default: "EmptyView"
    },
    frame: { type: "string" },
    backgroundColor: { type: "string" },
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
  dependencies: {
    type: {
      oneOf: [
        {
          properties: {
            type: { enum: ["EmptyView"] }
          },
        },
        {
          properties: {
            type: { enum: ["Button"] },
            text: { type: "string" },
            action: { type: "string" }
          },
          required: ["text", "action"]
        },
        {
          properties: {
            type: { enum: ["Image"] },
            source: {
              type: "object",
              properties: {
                src: { type: "string", default: "default.png" },
                origin: { type: "string", enum: ["Url", "Assets", "System"], default: "Assets" }
              },
              required: ["src", "origin"]
            },
            contentMode: { type: "string", enum: ["FIT", "FILL", "ASPECTFIT", "ASPECTFILL", "CENTER"], default: "FIT" }
          },
          required: ["source"]
        },
        {
          properties: {
            type: { enum: ["Text"] },
            text: { type: "string" },
            font: {
              type: "object",
              properties: {
                font: { type: "string" },
                color: { type: "string" }
              },
              required: ["font", "color"]
            }
          },
          required: ["text", "font"]
        },
        {
          properties: {
            type: { enum: ["TextField"] },
            text: { type: "string" },
            placeholder: { type: "string" },
            secure: { type: "boolean" },
            keyboardType: { type: "string", enum: ["default", "number-pad", "decimal-pad", "numeric", "email-address", "phone-pad"], default: "default" },
            font: {
              type: "object",
              properties: {
                font: { type: "string" },
                color: { type: "string" }
              },
              required: ["font", "color"]
            },
          },
          required: ["placeholder", "keyboardType", "font"]
        }
      ]
    }
  }
};











