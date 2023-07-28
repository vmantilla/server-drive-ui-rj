// Archivo: createSDComponent.js

import SDProperties from '../models/structs/SDProperties';
import SDFont from '../models/structs/properties/SDFont';
import SDCornerRadius from '../models/structs/properties/SDCornerRadius';
import SDComponent from '../models/structs/SDComponent';

export function createSDComponent(componentData) {
  // Comprobamos si 'properties' existe antes de intentar acceder a sus subpropiedades
  const propertiesExist = componentData && componentData.properties;

  const sdFont = propertiesExist && componentData.properties.font
    ? new SDFont(componentData.properties.font.font, componentData.properties.font.color)
    : null;

  const sdCornerRadius = propertiesExist && componentData.properties.cornerRadius
    ? new SDCornerRadius(componentData.properties.cornerRadius)
    : null;

  // Creamos las propiedades del componente
  const properties = propertiesExist ? new SDProperties(
    componentData.properties.frame,
    componentData.properties.backgroundColor,
    sdCornerRadius,
    componentData.properties.border,
    componentData.properties.padding,
    componentData.properties.isEnabled,
    componentData.properties.contentInset,
    componentData.properties.text,
    sdFont,
    componentData.properties.textAlignment,
    componentData.properties.action,
    componentData.properties.source,
    componentData.properties.contentMode,
    componentData.properties.resizable,
    componentData.properties.aspectRatio,
    componentData.properties.spacing,
    componentData.properties.verticalAlignment,
    componentData.properties.horizontalAlignment,
    componentData.properties.overlayAlignment,
    componentData.properties.axis,
    componentData.properties.showsIndicators,
    componentData.properties.placeholder,
    componentData.properties.secure,
    componentData.properties.keyboardType,
    componentData.properties.autocapitalization,
    componentData.properties.autocorrection,
    componentData.properties.returnKeyType,
    componentData.properties.enablesReturnKeyAutomatically,
    componentData.properties.onEditingChanged,
    componentData.properties.onCommit
  ) : null;

  // Si el componente tiene hijos, los creamos también
  const children = componentData.children?.map(createSDComponent);

  // Finalmente, creamos y devolvemos el componente SD
  return new SDComponent(
    componentData.id,
    componentData.type,
    properties,
    children,
    componentData.states
  );
}

