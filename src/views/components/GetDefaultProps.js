import SDProperties from '../../models/structs/SDProperties';
import SDComponent from '../../models/structs/SDComponent';
import SDComponentType from '../../enums/SDComponentType';
import SDCornerRadius from '../../models/structs/properties/SDCornerRadius';
import { v4 as uuidv4 } from 'uuid'; 

const getDefaultVStackProperties = () => {
  return new SDProperties(
    { width: "100%", height: 100 },
    'primaryContainer',
    new SDCornerRadius({ shape: 'small'}),
    { color: 'primaryContainer', width: 1 },
    null,
    true,
    { top: 0, bottom: 0, leading: 0, trailing: 0 }, // Dummy contentInset
    "VStack Dummy Text", // Dummy text
    { family: "Arial", size: 12, weight: "normal", color: "black" }, // Dummy font
    "center", // Dummy text alignment
    null, // Dummy action
    null, // Dummy source
    "scaleToFill", // Dummy content mode
    false, // Dummy resizable
    null, // Dummy aspectRatio
    10, // Dummy spacing
    "center", // Dummy vertical alignment
    "center", // Dummy horizontal alignment
    "center", // Dummy overlay alignment
    "vertical", // Dummy axis
    false, // Dummy shows indicators
    null, // Dummy placeholder
    false, // Dummy secure
    "default", // Dummy keyboard type
    "sentences", // Dummy autocapitalization
    "default", // Dummy autocorrection
    "default", // Dummy return key type
    false, // Dummy enablesReturnKeyAutomatically
    null, // Dummy onEditingChanged
    null // Dummy onCommit
  );
}

const getDefaultHStackProperties = () => {
  return new SDProperties(
    { height: 100 },
    'primaryContainer',
    new SDCornerRadius({ shape: 'small'}),
    { color: 'primaryContainer', width: 1 },
    true
  );
}

const getDefaultZStackProperties = () => {
  return new SDProperties(
    { width: 100, height: 100 },
    'primaryContainer',
    new SDCornerRadius({ shape: 'small'}),
    { color: 'primaryContainer', width: 1 },
    { top: 10, bottom: 10, left: 10, right: 10 },
    true
  );
}

const getDefaultTextProperties = () => {
  return new SDProperties(
    { width: "auto", height: "auto" },
    null,
    null,
    null,
    null,
    true
  );
}

const getDefaultButtonProperties = () => {
  return new SDProperties(
    { width: "100px", height: "50px" },
    'primaryContainer',
    new SDCornerRadius({ shape: 'small'}),
    { color: 'primaryContainer', width: 1 },
    { top: 10, bottom: 10, left: 10, right: 10 },
    true
  );
}

const getDefaultImageProperties = () => {
  return new SDProperties(
    { width: "100px", height: "100px" },
    null,
    null,
    null,
    null,
    true
  );
}

const getDefaultTextFieldProperties = () => {
  return new SDProperties(
    { width: "200px", height: "40px" },
    'primaryContainer',
    new SDCornerRadius({ shape: 'small'}),
    { color: 'primaryContainer', width: 1 },
    { top: 5, bottom: 5, left: 10, right: 10 },
    true
  );
}

const getDefaultScrollViewProperties = () => {
  return new SDProperties(
    { width: "100%", height: "100%" },
    'primaryContainer',
    new SDCornerRadius({ shape: 'small'}),
    { color: 'primaryContainer', width: 1 },
    { top: 5, bottom: 5, left: 10, right: 10 },
    true
  );
}

const getDefaultScrollViewMain = () => {
    return new SDComponent(
        uuidv4(),
        SDComponentType[SDComponentType.ScrollView],
        new SDProperties(
    { width: "100%", height: "100%" },
    'primaryContainer',
    new SDCornerRadius({ shape: 'small'}),
    { color: 'primaryContainer', width: 1 },
    true
  ),
        [],
        {}
    );
}

function getUnnownProperties() {
    const frame = {
        width: '100%',
        height: 100
    };

    const padding = {
        top: 8,
        bottom: 8
    };

    const border = {
        colorValue: 'primary', // color gris claro
        width: 1 // ancho del borde
    };

    // Aquí se crean las propiedades del stack
    const properties = new SDProperties(
        frame, // Marco que define el tamaño y la posición
        'primaryContainer', // Color de fondo transparente
        null, // Sin borde redondeado
        border, // Borde
        padding, // Padding
        true, // Habilitado
        null, // Sin inserción de contenido
        null, // Sin texto
        null, // Sin fuente
        null, // Sin alineación de texto
        null, // Sin acción
        null, // Sin fuente de imagen
        null, // Sin modo de contenido de la imagen
        null, // Sin ajuste de tamaño de la imagen
        null, // Sin relación de aspecto de la imagen
        null, // Sin espaciado
        null, // Sin alineación vertical
        null, // Sin alineación horizontal
        null, // Sin alineación de superposición
        null, // Sin eje
        null, // Sin indicadores de desplazamiento
        null, // Sin texto de marcador de posición
        null, // Sin entrada de texto segura
        null, // Sin tipo de teclado
        null, // Sin capitalización automática
        null, // Sin corrección automática
        null, // Sin tipo de tecla de retorno
        null, // Sin habilitación automática de la tecla de retorno
        null, // Sin cambio de edición
        null  // Sin confirmación
    );

    return properties;
}

const getDefaultProps = (componentType) => {
  switch(componentType) {
    case SDComponentType.VStack:
      return getDefaultVStackProperties();
    case SDComponentType.HStack:
      return getDefaultHStackProperties();
    case SDComponentType.ZStack:
      return getDefaultZStackProperties();
    case SDComponentType.Text:
      return getDefaultTextProperties();
    case SDComponentType.Button:
      return getDefaultButtonProperties();
    case SDComponentType.Image:
      return getDefaultImageProperties();
    case SDComponentType.TextField:
      return getDefaultTextFieldProperties();
    case SDComponentType.ScrollView:
      return getDefaultScrollViewProperties();
    default:
      return getDefaultScrollViewMain();
  }
}

export default getDefaultProps;
