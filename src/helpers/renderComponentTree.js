// Archivo: renderComponentTree.js
import SDVStackView from '../models/components/SDVStackView';
import SDHStackView from '../models/components/SDHStackView';
import SDZStackView from '../models/components/SDZStackView';
import SDTextView from '../models/components/SDTextView';
import SDImageView from '../models/components/SDImageView';
import SDButtonView from '../models/components/SDButtonView';
import SDScrollView from '../models/components/SDScrollView';

export function renderComponentTree(component, isBuilderMode, setActiveStackId) {
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
      isBuilderMode = {isBuilderMode}
      setActiveStackId = {setActiveStackId}
    >
      {component.childrens && component.childrens.length > 0 && component.childrens.map(childComponent => renderComponentTree(childComponent, isBuilderMode, setActiveStackId))}
    </Component>
  );
}
