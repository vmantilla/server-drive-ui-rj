// Archivo: renderBuilderComponentTree.js
import SDVStackView from './renders/RenderVStackView';
import SDHStackView from './renders/RenderHStackView';
import SDZStackView from './renders/RenderZStackView';
import SDTextView from './renders/RenderTextView';
import SDImageView from './renders/RenderImageView';
import SDButtonView from './renders/RenderButtonView';
import SDScrollView from './renders/RenderScrollView';

export function renderBuilderComponentTree(component, setDroppedComponents, droppedComponents) {
 
  let Component;

  switch (component.type) {
    case "VStack":
      Component = SDVStackView
      break;
    case "HStack":
      Component = SDHStackView;
      break;
    case "ZStack":
      Component = SDZStackView;
      break;
    case "Text":
      Component = SDTextView; 
      break;
    case "Button":
      Component = SDButtonView; 
      break;
    case "Image":
      Component = SDImageView; 
      break;
    case "TextField":
      Component = 'div'; 
      break;
    case "ScrollView":
      Component = SDScrollView;
      break;
    default:
      Component = 'div'; 
  }

  return (
    <Component 
      key={component.id} 
      component={component}
      setDroppedComponents={setDroppedComponents}
      droppedComponents={droppedComponents}
    >
      {component.childrens && component.childrens.length > 0 && component.childrens.map(childComponent => renderBuilderComponentTree(childComponent, setDroppedComponents, droppedComponents))}
    </Component>
  );
}

