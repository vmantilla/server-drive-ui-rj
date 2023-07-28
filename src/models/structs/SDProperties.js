class SDProperties {
  constructor({
    component_type = '',
    frame = {},
    backgroundColor = '',
    cornerRadius = {},
    border = {},
    isEnabled = true,
    margin = {},
    text = '',
    font = {},
    textAlignment = '',
    action = '',
    source = '',
    contentMode = '',
    resizable = '',
    aspectRatio = '',
    spacing = '',
    verticalAlignment = '',
    horizontalAlignment = '',
    overlayAlignment = '',
    axis = '',
    showsIndicators = '',
    placeholder = '',
    secure = '',
    keyboardType = '',
    autocapitalization = '',
    autocorrection = '',
    returnKeyType = '',
    enablesReturnKeyAutomatically = '',
    onEditingChanged = '',
    onCommit = '',
    lineLimit = ''
  } = {}) {
    this.component_type = component_type;
    this.frame = frame;
    this.backgroundColor = backgroundColor;
    this.cornerRadius = cornerRadius;
    this.border = border;
    this.isEnabled = isEnabled;
    this.margin = margin;
    this.text = text;
    this.font = font;
    this.textAlignment = textAlignment;
    this.action = action;
    this.source = source;
    this.contentMode = contentMode;
    this.resizable = resizable;
    this.aspectRatio = aspectRatio;
    this.spacing = spacing;
    this.verticalAlignment = verticalAlignment;
    this.horizontalAlignment = horizontalAlignment;
    this.overlayAlignment = overlayAlignment;
    this.axis = axis;
    this.showsIndicators = showsIndicators;
    this.placeholder = placeholder;
    this.secure = secure;
    this.keyboardType = keyboardType;
    this.autocapitalization = autocapitalization;
    this.autocorrection = autocorrection;
    this.returnKeyType = returnKeyType;
    this.enablesReturnKeyAutomatically = enablesReturnKeyAutomatically;
    this.onEditingChanged = onEditingChanged;
    this.onCommit = onCommit;
    this.lineLimit = lineLimit;
  }

    toJSON() {
  const output = {};

  if (this && typeof this === 'object') {
    for (const [key, value] of Object.entries(this)) {
      try {
        if (
          value !== '' &&
          !(typeof value === 'object' && Object.keys(value).length === 0)
        ) {
          output[key] = value;
        }
      } catch (error) {
        console.error(`Error al procesar la propiedad "${key}":`, error);
      }
    }
  }

  return output;
}

    static fromJSON(json) {
        const properties = Object.create(SDProperties.prototype);
        return Object.assign(properties, json);
    }
}

export default SDProperties;

