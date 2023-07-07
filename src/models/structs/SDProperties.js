import { themesData } from '../../styles/themes';

class SDProperties {
    constructor(frame, backgroundColor, cornerRadius, border, padding, isEnabled, contentInset, text, font, textAlignment, action, source, contentMode, resizable, aspectRatio, spacing, verticalAlignment, horizontalAlignment, overlayAlignment, axis, showsIndicators, placeholder, secure, keyboardType, autocapitalization, autocorrection, returnKeyType, enablesReturnKeyAutomatically, onEditingChanged, onCommit) {
        this.frame = frame;
        this.backgroundColor = backgroundColor;
        this.cornerRadius = cornerRadius;
        this.border = border;
        this.padding = padding;
        this.isEnabled = isEnabled;
        this.contentInset = contentInset;
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
    }

    // Asume que DesignSystemManager.shared.designSystem.colors[backgroundColor] devuelve un objeto con 'value' y 'opacity'.
    backgroundColorValue(opacity = null) {
        const colorData = themesData.colors[this.backgroundColor || ''];
    
        if (!colorData) {
          return 'transparent';
        }

        const { value, opacity: defaultOpacity } = colorData;
        const customOpacity = opacity !== undefined ? opacity : defaultOpacity;
        const hex = value.startsWith('#') ? value.substring(1) : value;

        return `rgba(${parseInt(hex.substring(0, 2), 16)}, ${parseInt(hex.substring(2, 4), 16)}, ${parseInt(hex.substring(4, 6), 16)}, ${customOpacity})`;
    }

}

export default SDProperties;
