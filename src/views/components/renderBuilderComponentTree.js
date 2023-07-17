import RenderContainerView from './renders/RenderContainerView';
import RenderObjectView from './renders/RenderObjectView';
import RenderSpaceView from './renders/RenderSpaceView';

export function renderBuilderComponentTree(component, handleDrop, onComponentClick, index, moveChildrens) {

  let Component;

  if (!component) {
    console.error('El componente es undefined');
    return;
  }

  switch (component.type) {
    case "ContainerView":
      Component = RenderContainerView
      break;
    case "Object":
      Component = RenderObjectView; 
      break;
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
      moveChildrens={moveChildrens}
    >
      {component.childrens && component.childrens.length > 0 && component.childrens.map((childComponent, i) => renderBuilderComponentTree(childComponent, handleDrop, onComponentClick, i, moveChildrens))}
    </Component>
  );
}
