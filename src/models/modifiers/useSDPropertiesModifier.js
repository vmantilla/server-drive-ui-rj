import React from 'react';
import { themesData } from '../../styles/themes';



function useSDPropertiesModifier(properties = {}, divStyle = {}) {
  // Si no se proporcionan las propiedades, devolvemos el estilo div proporcionado
  if (!properties || Object.keys(properties).length === 0) return divStyle;


  const frame = properties?.frame || {};
  

  let font = null;
  let color = null;
  let textAlignment = null;
  let lineLimit = null;

  if ((properties.componentType === 'Text' || properties.componentType === 'TextField') && properties.font) {
    font = fontValue(properties.font);
    color = colorValue(properties.font?.color, 1.0);  
  }

  if (properties.componentType === 'Text') {
    textAlignment = getTextAlignment(properties.textAlignment);
    lineLimit = properties.lineLimit;
  }


  // Calculamos el valor total del margen
  const marginHorizontal = (properties.margin?.left ?? 0) + (properties.margin?.right ?? 0);
  const marginVertical = (properties.margin?.top ?? 0) + (properties.margin?.bottom ?? 0);
  // Si el frame está ausente, usamos los valores por defecto
  const frameStyle = properties.frame ? frameToStyle(properties.frame, marginHorizontal, marginVertical) : {};

  const spacing = properties.spacing ?? 0;

  return {
    ...divStyle,
    ...frameStyle,
    backgroundColor:
      divStyle.backgroundColor ??
      (properties.backgroundColor ? colorValue(properties.backgroundColor, 1.0) : 'transparent') ??
      'transparent',
    borderRadius: properties.cornerRadius
      ? cornerRadiusValue(frame, properties.cornerRadius)
      : 0,
    borderColor:
      divStyle.borderColor ??
      (properties.border?.color && colorValue(properties.border.color, 1.0)) ??
      'transparent',
    borderWidth: divStyle.borderWidth ?? properties.border?.width ?? 0,
    borderStyle: 'solid', 
    marginTop: properties.margin?.top ?? 0,
    marginLeft: properties.margin?.left ?? 0,
    marginBottom: properties.margin?.bottom ?? 0,
    marginRight: properties.margin?.right ?? 0,
    paddingTop: properties.padding?.top ?? 0,
    paddingLeft: properties.padding?.left ?? 0,
    paddingBottom: properties.padding?.bottom ?? 0,
    paddingRight: properties.padding?.right ?? 0,
    gap: `${spacing}px`,
    textAlign: textAlignment,
    ...font,
    color: color
  };
}

// Calcula los valores de las propiedades de la fuente
const fontValue = (fontProp) => {

  if (!themesData || !themesData.fonts) {
    return {};
  }

  const font = themesData.fonts[fontProp.font || ''];


  
  if (!font) {
    return { 
      fontFamily: 'Arial', 
      fontSize: 12, 
      fontWeight: 400, 
      lineHeight: '16px', 
      letterSpacing: 'normal'
    };
  }

  let weight = font.weight || 400;
  let lineHeight = `${font.lineHeight || 16}px`;
  let letterSpacing = font.letterSpacing || 'normal';

  if (typeof window !== 'undefined' && window.FontFace && document.fonts && font.url) {
    const fontFace = new window.FontFace(font.name, `url(${font.url})`);
    document.fonts.add(fontFace);
  }

  return { 
    fontFamily: font.url ? font.name : 'Arial', 
    fontSize: font.size, 
    fontWeight: weight, 
    lineHeight: lineHeight, 
    letterSpacing: letterSpacing
  };
};

const frameToStyle = (frame, marginHorizontal, marginVertical) => {
  let style = {};

  const processValue = (value, dimension) => {
    if (value === null) {
      return value;
    } else if (typeof value === 'number' || (typeof value === 'string' && !isNaN(value))) {
      return `${Number(value)}px`;
    } else if (typeof value === 'string') {
      if (value === 'auto') {
        return value;
      } else if (value.includes('%')) {
        if (dimension === 'width') {
          return `calc(${value} - ${marginHorizontal}px)`;
        } else if (dimension === 'height') {
          return `calc(${value} - ${marginVertical}px)`;
        }
      }
    } else {
      return value;
    }
  };

  ['width', 'height'].forEach((dimension) => {
    const value = frame[dimension];

    if (typeof value === 'number' || typeof value === 'string') {
      style[dimension] = processValue(value, dimension);
    } else if (typeof value === 'object' && value !== null) {
      if ('min' in value && value.min != null) style[`min${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`] = processValue(value.min, dimension);
      if ('max' in value && value.max != null) style[`max${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`] = processValue(value.max, dimension);
    }
  });

  return style;
};




const cornerRadiusValue = (frame, cornerRadiusObject) => {
  let corners = cornerRadiusObject.corners;
  let shape = cornerRadiusObject.shape;

  let defaultRadius;
  switch (shape) {
    case "none":
      defaultRadius = 0;
      break;
    case "extraSmall":
      defaultRadius = 5;
      break;
    case "small":
      defaultRadius = 10;
      break;
    case "medium":
      defaultRadius = 20;
      break;
    case "large":
      defaultRadius = 30;
      break;
    case "extraLarge":
      defaultRadius = 40;
      break;
    case "full":
      defaultRadius = (frame?.height ?? 0) * 0.5;
      break;
    default:
      defaultRadius = 0;
      break;
  }

  return `${corners?.topStart ?? defaultRadius}px ${corners?.topEnd ?? defaultRadius}px ${corners?.bottomEnd ?? defaultRadius}px ${corners?.bottomStart ?? defaultRadius}px`;
};

const colorValue = (colorName, opacity = null) => {
  if (!themesData || !themesData.colors) {
    return 'transparent';
  }
  
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

// Esta función recibe el valor de textAlignment y devuelve el correspondiente valor de CSS
export const getTextAlignment = (textAlignment) => {
  switch(textAlignment) {
    case 'Start':
      return 'left';
    case 'Center':
      return 'center';
    case 'End':
      return 'right';
    default:
      return 'left';
  }
};


export default useSDPropertiesModifier;
