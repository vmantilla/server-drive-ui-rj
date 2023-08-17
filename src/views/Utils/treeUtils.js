// treeUtils.js

export const toggleExpanded = (targetId, currentComponents) => 
  currentComponents.map(component => {
    if (component.id === targetId) {
      return { ...component, expanded: !component.expanded };
    }
    if (component.children.length > 0) {
      return { ...component, children: toggleExpanded(targetId, component.children) };
    }
    return component;
  });

export const deleteComponentRecursive = (idToDelete, currentComponents) => 
  currentComponents.filter(comp => comp.id !== idToDelete).map(component => {
    if (component.children.length > 0) {
      component.children = deleteComponentRecursive(idToDelete, component.children);
    }
    return component;
  });

export const addComponentChildRecursive = (parentId, currentComponents, childComponent) => 
  currentComponents.map(component => {
    if (component.id === parentId) {
      return { ...component, children: [...component.children, childComponent] };
    }
    if (component.children.length > 0) {
      return { ...component, children: addComponentChildRecursive(parentId, component.children, childComponent) };
    }
    return component;
  });

export const removeComponent = (componentId, currentComponents) => 
  currentComponents.reduce((acc, component) => {
    if (component.id !== componentId) {
      if (component.children.length) {
        component.children = removeComponent(componentId, component.children);
      }
      acc.push(component);
    }
    return acc;
  }, []);

export const isDescendant = (parentComponent, targetId) => {
  for (let child of parentComponent.children) {
    if (child.id === targetId || isDescendant(child, targetId)) {
      return true;
    }
  }
  return false;
};
