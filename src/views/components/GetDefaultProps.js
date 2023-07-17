import SDProperties from '../../models/structs/SDProperties';
import SDComponent from '../../models/structs/SDComponent';
import SDComponentType from '../../enums/SDComponentType';
import SDCornerRadius from '../../models/structs/properties/SDCornerRadius';
import { v4 as uuidv4 } from 'uuid'; 

const getDefaultObjectProperties = () => {
  return new SDProperties(
    { width: 100, height: 100 },
    null,
    new SDCornerRadius({ shape: 'small'}),
    { color: 'outline', width: 1 },
    null,
    true,
    { top: 0, bottom: 0, left: 2, right: 2 },
    null
  );
}

const getDefaultVStackProperties = () => {
  return new SDProperties(
    { height: 100 },
    null,
    new SDCornerRadius({ shape: 'small'}),
    { color: 'outline', width: 1 },
    null,
    true,
    { top: 2, bottom: 2, left: 2, right: 2 },
    null
  );
}

const getDefaultHStackProperties = () => {
  return new SDProperties(
    { height: "auto" },
    null,
    new SDCornerRadius({ shape: 'small'}),
    { color: 'outline', width: 1 },
    null,
    true,
    { top: 2, bottom: 2, left: 2, right: 2 },
    null
  );
}

const getDefaultZStackProperties = () => {
  return new SDProperties(
    { height: 100 },
    null,
    new SDCornerRadius({ shape: 'small'}),
    { color: 'outline', width: 1 },
    null,
    true,
    { top: 2, bottom: 2, left: 2, right: 2 },
    null
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


const getDefaultSpaceViewProperties = () => {
  return new SDProperties(
    { height: "100%", width: "100%" },
    'primaryContainer',
    new SDCornerRadius({ shape: 'small'}),
    {},
    { top: 0, bottom: 0, left: 0, right: 0 },
    true
  );
}

function getUnnownProperties() {
    const frame = {
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
    case SDComponentType.Space:
      return getDefaultSpaceViewProperties();
    case SDComponentType.Object:
      return getDefaultObjectProperties();
    default:
      return getDefaultObjectProperties();
  }
}

export default getDefaultProps;
