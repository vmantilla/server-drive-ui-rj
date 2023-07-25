class SDProperties {
    constructor(componentType, frame, backgroundColor, cornerRadius, border, margin, isEnabled, padding, text, font, textAlignment, action, source, contentMode, resizable, aspectRatio, spacing, verticalAlignment, horizontalAlignment, overlayAlignment, axis, showsIndicators, placeholder, secure, keyboardType, autocapitalization, autocorrection, returnKeyType, enablesReturnKeyAutomatically, onEditingChanged, onCommit, src, origin) {
        this.componentType = componentType;
        this.frame = frame;
        this.backgroundColor = backgroundColor;
        this.cornerRadius = cornerRadius;
        this.border = border;
        this.margin = margin;
        this.isEnabled = isEnabled;
        this.padding = padding;
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
        this.src = src;
        this.origin = origin;
    }

    toJSON() {
        return {
            componentType: this.componentType,
            frame: this.frame,
            backgroundColor: this.backgroundColor,
            cornerRadius: this.cornerRadius,
            border: this.border,
            margin: this.margin,
            isEnabled: this.isEnabled,
            padding: this.padding,
            text: this.text,
            font: this.font,
            textAlignment: this.textAlignment,
            action: this.action,
            source: this.source,
            contentMode: this.contentMode,
            resizable: this.resizable,
            aspectRatio: this.aspectRatio,
            spacing: this.spacing,
            verticalAlignment: this.verticalAlignment,
            horizontalAlignment: this.horizontalAlignment,
            overlayAlignment: this.overlayAlignment,
            axis: this.axis,
            showsIndicators: this.showsIndicators,
            placeholder: this.placeholder,
            secure: this.secure,
            keyboardType: this.keyboardType,
            autocapitalization: this.autocapitalization,
            autocorrection: this.autocorrection,
            returnKeyType: this.returnKeyType,
            enablesReturnKeyAutomatically: this.enablesReturnKeyAutomatically,
            onEditingChanged: this.onEditingChanged,
            onCommit: this.onCommit,
            src: this.src,
            origin: this.origin
        };
    }

    static fromJSON(json) {
        const properties = Object.create(SDProperties.prototype);
        return Object.assign(properties, json);
    }
}

export default SDProperties;
