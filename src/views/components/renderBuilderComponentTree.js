import RenderContainerView from './renders/RenderContainerView';
import RenderObjectView from './renders/RenderObjectView';
import RenderSpaceView from './renders/RenderSpaceView';

export function renderBuilderComponentTree(component, handleDrop, onComponentClick, index, moveChildrens, selectedComponent) {

  let Component;

  if (!component) {
    console.error('El componente es undefined');
    return;
  }

  if (!component.properties) {
    console.error('El componente properties es undefined');
    return;
  }

  const properties = component?.properties || {};

  switch (component.componentType) {
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
    selectedComponent={selectedComponent} 
  >
    {component.childrens && component.childrens.length > 0 && component.childrens.map((childComponent, i) => {
      // Verifica si el componente hijo tiene propiedades antes de intentar renderizarlo
      if (childComponent.properties) {
        return renderBuilderComponentTree(childComponent, handleDrop, onComponentClick, i, moveChildrens, selectedComponent)
      } else {
        console.warn(`El componente hijo en el índice ${i} no tiene propiedades y no se renderizará.`);
      }
    })}
  </Component>
);

}
