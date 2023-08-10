import SDProperties from '../../models/structs/SDProperties';
import SDComponent from '../../models/structs/SDComponent';
import SDComponentType from '../../enums/SDComponentType';
import SDCornerRadius from '../../models/structs/properties/SDCornerRadius';
import { v4 as uuidv4 } from 'uuid'; 

const getDefaultObjectProperties = () => {
  return new SDProperties({
    component_type: "EmptyView",
    frame: { width: "100", height: "100" }
  });
}

const getDefaultContainerViewProperties = () => {
  return new SDProperties({
    component_type: "Row",
    frame: { width: "100%", height: "100" }
  });
}

const getDefaultScrollViewProperties = () => {
  return new SDProperties({
    component_type: "Column",
    frame: { width: "100%", height: "100%" }
  });
}

const getDefaultButtonViewProperties = () => {
  return new SDProperties({
    component_type: "Row",
    frame: { width: "auto", height: "auto" }
  });
}

export const getDefaultTextViewProperties = () => {
  return new SDProperties({
    component_type: "Text",
    text: "Text",
    frame: { width: "auto", height: "auto" }
  });
}


const getDefaultSpaceViewProperties = () => {
  return new SDProperties({
    component_type: "Space",
    frame: { height: "100%", width: "100%" }
  });
}

export const getDefaultProps = (component_type) => {
  switch(component_type) {
    case SDComponentType.ContainerView:
      return getDefaultContainerViewProperties();
    case SDComponentType.Space:
      return getDefaultSpaceViewProperties();
    case SDComponentType.Object:
      return getDefaultObjectProperties();
    case SDComponentType.Button:
      return getDefaultButtonViewProperties()
    case SDComponentType.ScrollView:
      return getDefaultScrollViewProperties()
    default:
      return getDefaultObjectProperties();
  }
}
