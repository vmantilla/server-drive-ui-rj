import SDVStackView from './renders/RenderVStackView';
import SDHStackView from './renders/RenderHStackView';
import SDZStackView from './renders/RenderZStackView';
import SDTextView from './renders/RenderTextView';
import SDImageView from './renders/RenderImageView';
import SDButtonView from './renders/RenderButtonView';
import SDScrollView from './renders/RenderScrollView';
import RenderSpaceView from './renders/RenderSpaceView';

export function renderBuilderComponentTree(component, handleDrop, onComponentClick, index, moveButton) {


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
    case "Space":
      Component = RenderSpaceView;
      break;
    default:
      Component = 'div'; 
  }

  return (
    <Component 
      key={component.id} 
      component={component}
      handleDrop={handleDrop}
      onClick={onComponentClick}
      index={index}
      moveButton={moveButton}
    >
      {component.childrens && component.childrens.length > 0 && component.childrens.map((childComponent, i) => renderBuilderComponentTree(childComponent, handleDrop, onComponentClick, i, moveButton))}
    </Component>
  );
}
