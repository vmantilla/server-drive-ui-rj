import SDProperties from '../../models/structs/SDProperties';
import SDComponent from '../../models/structs/SDComponent';
import SDComponentType from '../../enums/SDComponentType';
import SDCornerRadius from '../../models/structs/properties/SDCornerRadius';
import { v4 as uuidv4 } from 'uuid'; 

const getDefaultObjectProperties = () => {
  return new SDProperties(
    "EmptyView",
    { width: 100, height: 100 },
    null,
    new SDCornerRadius({ shape: 'none'}),
    { color: 'outline', width: 1 },
    null,
    true,
    { top: 0, bottom: 0, left: 2, right: 2 },
    null
  );
}

const getDefaultContainerViewProperties = () => {
  return new SDProperties(
    "Row",
    { width: "100%", height: "100" },
    null,
    new SDCornerRadius({ shape: 'none'}),
    { color: 'outline', width: 1 },
    null,
    true,
    { top: 2, bottom: 2, left: 2, right: 2 },
    null
  );
}


const getDefaultSpaceViewProperties = () => {
  return new SDProperties(
    "Space",
    { height: "100%", width: "100%" },
    'primaryContainer',
    new SDCornerRadius({ shape: 'none'}),
    {},
    { top: 0, bottom: 0, left: 0, right: 0 },
    true
  );
}

const getDefaultProps = (componentType) => {
  switch(componentType) {
    case SDComponentType.ContainerView:
      return getDefaultContainerViewProperties();
    case SDComponentType.Space:
      return getDefaultSpaceViewProperties();
    case SDComponentType.Object:
      return getDefaultObjectProperties();
    default:
      return getDefaultObjectProperties();
  }
}

export default getDefaultProps;
