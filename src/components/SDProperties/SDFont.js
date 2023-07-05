import { themesData } from '../../themes';

class SDFont {
  constructor(font, color) {
    this.font = font;
    this.color = color;
  }

  fontValue() {
    const font = themesData.fonts[this.font || ''];
    
    if (!font) {
      return { fontSize: 12 };
    }

    let weight;

    switch (true) {
      case font.weight >= 100 && font.weight < 200:
        weight = 'ultraLight';
        break;
      case font.weight >= 200 && font.weight < 300:
        weight = 'thin';
        break;
      case font.weight >= 300 && font.weight < 400:
        weight = 'light';
        break;
      case font.weight >= 400 && font.weight < 500:
        weight = 'regular';
        break;
      case font.weight >= 500 && font.weight < 600:
        weight = 'medium';
        break;
      case font.weight >= 600 && font.weight < 700:
        weight = 'semibold';
        break;
      case font.weight >= 700 && font.weight < 800:
        weight = 'bold';
        break;
      case font.weight >= 800 && font.weight < 900:
        weight = 'heavy';
        break;
      default:
        weight = 'black';
    }

    if (typeof window !== 'undefined' && window.FontFace && document.fonts) {
      const fontFace = new window.FontFace(font.name, `url(${font.url})`);
      document.fonts.add(fontFace);
      return { fontFamily: font.name, fontSize: font.size, fontWeight: weight };
    } else {
      return { fontSize: font.size, fontWeight: weight };
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
