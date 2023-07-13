import React from 'react';
import { themesData } from '../../styles/themes';

function useSDPropertiesModifier(properties = {}, divStyle = {}) {
  // Si no se proporcionan las propiedades, devolvemos el estilo div proporcionado
  if (!properties || Object.keys(properties).length === 0) return divStyle;

  // Si el frame está ausente, usamos los valores por defecto
  const frame = properties.frame || {};

  // Calculamos el valor total del margen
  const marginHorizontal = (properties.padding?.left ?? 0) + (properties.padding?.right ?? 0);
  const marginVertical = (properties.padding?.top ?? 0) + (properties.padding?.bottom ?? 0);

  // Aquí puedes definir cómo se aplicarán las propiedades a los estilos
  // Por ejemplo, usando los valores predeterminados en caso de que las propiedades no estén definidas

  let maxWidth = frame.maxWidth ?? frame.width ?? '100%';
  if (maxWidth === '100%' && marginHorizontal) {
    maxWidth = `calc(${maxWidth} - ${marginHorizontal}px)`;
  }

  let maxHeight = frame.maxHeight ?? frame.height ?? '100%';
  if (maxHeight === '100%' && marginVertical) {
    maxHeight = `calc(${maxHeight} - ${marginVertical}px)`;
  }

// Si la propiedad 'border' está presente, imprime un log
  
  return {
    ...divStyle,
    minWidth: divStyle.minWidth ?? frame.minWidth ?? frame.width ?? 0,
    maxWidth: maxWidth,
    minHeight: divStyle.minHeight ?? frame.minHeight ?? frame.height ?? 0,
    maxHeight: maxHeight,
    backgroundColor: divStyle.backgroundColor 
      ?? (properties.backgroundColor ? colorValue(properties.backgroundColor, 1.0) : 'transparent')
      ?? 'transparent',
    borderRadius: (typeof properties.cornerRadius === 'function') ? properties.cornerRadius(frame) : (properties.cornerRadius || 0),
    borderColor: divStyle.borderColor ?? 
             (properties.border?.color && colorValue(properties.border.color, 1.0)) ?? 
             'transparent',
    borderWidth: divStyle.borderWidth ?? properties.border?.width ??  0,
    marginTop: properties.padding?.top ?? 0,
    marginLeft: properties.padding?.left ?? 0,
    marginBottom: properties.padding?.bottom ?? 0,
    marginRight: properties.padding?.right ?? 0,
    paddingTop: properties.contentInset?.top ?? 0,
    paddingLeft: properties.contentInset?.left ?? 0,
    paddingBottom: properties.contentInset?.bottom ?? 0,
    paddingRight: properties.contentInset?.right ?? 0
  };
}



// Asume que DesignSystemManager.shared.designSystem.colors[backgroundColor] devuelve un objeto con 'value' y 'opacity'.
const colorValue = (colorName, opacity = null) => {
    const colorData = themesData.colors[colorName || ''];

    if (!colorData) {
      return 'transparent';
    }

    const { value, defaultOpacity } = colorData;
    const customOpacity = opacity !== undefined ? opacity : defaultOpacity;
    const hex = value.startsWith('#') ? value.substring(1) : value;

    return `rgba(${parseInt(hex.substring(0, 2), 16)}, ${parseInt(hex.substring(2, 4), 16)}, ${parseInt(hex.substring(4, 6), 16)}, ${customOpacity})`;
}


export const getAlignment = (alignment) => {
  switch (alignment) {
    case "TopStart":
      return { justifySelf: 'start', alignSelf: 'start' };
    case "TopCenter":
      return { justifySelf: 'start', alignSelf: 'center' };
    case "TopEnd":
      return { justifySelf: 'start', alignSelf: 'end' };
    case "CenterStart":
      return { justifySelf: 'center', alignSelf: 'start' };
    case "Center":
      return { justifySelf: 'center', alignSelf: 'center' };
    case "CenterEnd":
      return { justifySelf: 'center', alignSelf: 'end' };
    case "BottomStart":
      return { justifySelf: 'end', alignSelf: 'start' };
    case "BottomCenter":
      return { justifySelf: 'end', alignSelf: 'end' };
    case "BottomEnd":
      return { justifySelf: 'end', alignSelf: 'end' };
    default:
      return { justifySelf: 'center', alignSelf: 'center' };
  }
};

export default useSDPropertiesModifier;
