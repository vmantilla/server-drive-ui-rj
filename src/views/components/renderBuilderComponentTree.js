import SDVStackView from './renders/RenderVStackView';
import SDHStackView from './renders/RenderHStackView';
import SDZStackView from './renders/RenderZStackView';
import SDTextView from './renders/RenderTextView';
import SDImageView from './renders/RenderImageView';
import SDButtonView from './renders/RenderButtonView';
import SDScrollView from './renders/RenderScrollView';

export function renderBuilderComponentTree(component, handleDrop, level = 0) {

  let color;
  switch (level % 3) {  // Usamos módulo para ciclar entre 3 colores
    case 0:
      color = "red";
      break;
    case 1:
      color = "green";
      break;
    case 2:
      color = "blue";
      break;
    default:
      color = "black";
      break;
  }
 
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
      handleDrop={handleDrop}
      color={color}
    >
      {component.childrens && component.childrens.length > 0 && component.childrens.map(childComponent => renderBuilderComponentTree(childComponent, handleDrop, level + 1))}
    </Component>
  );
}
