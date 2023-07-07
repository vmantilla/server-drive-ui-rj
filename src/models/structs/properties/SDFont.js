import { themesData } from '../../../styles/themes';

class SDFont {
  constructor(font, color) {
    this.font = font;
    this.color = color;
  }

  fontValue() {
    const font = themesData.fonts[this.font || ''];

    if (!font) {
    // Establecer un valor predeterminado para la fuente
      return { fontFamily: 'Arial', fontSize: 12, fontWeight: 400, lineHeight: '16px' };
    }

    let weight = font.weight || 400;
    let lineHeight = `${font.lineHeight || 16}px`;

    if (typeof window !== 'undefined' && window.FontFace && document.fonts && font.url) {
      const fontFace = new window.FontFace(font.name, `url(${font.url})`);
      document.fonts.add(fontFace);
      return { fontFamily: font.name, fontSize: font.size, fontWeight: weight, lineHeight: lineHeight };
    } else {
    // Si no hay URL para la fuente, utiliza una fuente estándar del sistema
      return { fontFamily: 'Arial', fontSize: font.size, fontWeight: weight, lineHeight: lineHeight };
    }
  }


  colorValue(opacity) {
    const colorData = themesData.colors[this.color || ''];
    
    if (!colorData) {
      return 'transparent';
    }

    const { value, opacity: defaultOpacity } = colorData;
    const customOpacity = opacity !== undefined ? opacity : defaultOpacity;
    const hex = value.startsWith('#') ? value.substring(1) : value;

    return `rgba(${parseInt(hex.substring(0, 2), 16)}, ${parseInt(hex.substring(2, 4), 16)}, ${parseInt(hex.substring(4, 6), 16)}, ${customOpacity})`;
  }
}

export default SDFont;
