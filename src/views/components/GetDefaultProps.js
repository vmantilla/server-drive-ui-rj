import SDProperties from '../../models/structs/SDProperties';
import SDComponent from '../../models/structs/SDComponent';
import SDComponentType from '../../enums/SDComponentType';
import SDCornerRadius from '../../models/structs/properties/SDCornerRadius';
import { v4 as uuidv4 } from 'uuid'; 

const getDefaultObjectProperties = () => {
  return new SDProperties({
    component_type: "EmptyView",
    frame: { width: 100, height: 100 },
    cornerRadius: new SDCornerRadius({ shape: 'none'}),
    border: { color: 'outline', width: 1 },
    isEnabled: true,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });
}

const getDefaultContainerViewProperties = () => {
  return new SDProperties({
    component_type: "Row",
    frame: { width: "100%", height: "100" },
    cornerRadius: new SDCornerRadius({ shape: 'none'}),
    border: { color: 'outline', width: 1 },
    isEnabled: true,
    padding: { top: 2, bottom: 2, left: 2, right: 2 },
  });
}


const getDefaultSpaceViewProperties = () => {
  return new SDProperties({
    component_type: "Space",
    frame: { height: "100%", width: "100%" },
    backgroundColor: 'primaryContainer',
    cornerRadius: new SDCornerRadius({ shape: 'none'}),
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    isEnabled: true,
  });
}

const getDefaultProps = (component_type) => {
  switch(component_type) {
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
