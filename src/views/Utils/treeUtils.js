// treeUtils.js

export const deleteComponentRecursive = (idToDelete, currentComponents) => 
  currentComponents.filter(comp => comp.id !== idToDelete).map(component => {
    const newComponent = { ...component }; // Create a copy
    if (newComponent.children && newComponent.children.length > 0) {
      newComponent.children = deleteComponentRecursive(idToDelete, newComponent.children);
    }
    return newComponent;
  });

export const addComponentChildRecursive = (parentId, currentComponents, child) => {
  return currentComponents.map(component => {
    if (component.id === parentId) {
      return {
        ...component,
        children: [...(component.children || []), child], // Make sure children is iterable
        expanded: true 
      };
    } else if (component.children && component.children.length > 0) {
      return {
        ...component,
        children: addComponentChildRecursive(parentId, component.children, child)
      };
    }
    return component;
  });
};

export const removeComponent = (componentId, currentComponents) => 
  currentComponents.reduce((acc, component) => {
    const newComponent = { ...component }; // Create a copy
    if (newComponent.id !== componentId) {
      if (newComponent.children && newComponent.children.length) {
        newComponent.children = removeComponent(componentId, newComponent.children);
      }
      acc.push(newComponent);
    }
    return acc;
  }, []);


export const isDescendant = (parentComponent, targetId) => {
  if (parentComponent.children && Array.isArray(parentComponent.children)) {
    for (let child of parentComponent.children) {
      if (child.id === targetId || isDescendant(child, targetId)) {
        return true;
      }
    }
  }
  return false;
};


export const moveComponent = (componentId, parentId, currentComponents) => {
  // Primero, verificamos que el componente no se esté moviendo dentro de sí mismo.
  if (componentId === parentId) {
    throw new Error('No se puede mover un componente dentro de sí mismo.');
  }
  
  // Luego, buscamos el componente que queremos mover.
  const componentToMove = findComponentById(componentId, currentComponents);
  if (!componentToMove) {
    throw new Error(`No se encontró el componente con ID ${componentId}`);
  }
  
  // Asegurémonos de que el componente no sea descendiente del objetivo, en cuyo caso no podríamos moverlo.
  if (isDescendant(componentToMove, parentId)) {
    throw new Error('No se puede mover un componente dentro de sí mismo o dentro de un descendiente.');
  }
  
  // A continuación, quitamos el componente de su ubicación actual en el árbol.
  const updatedComponents = removeComponent(componentId, currentComponents);
  
  // Finalmente, agregamos el componente a los hijos del componente de destino.
  return addComponentChildRecursive(parentId, updatedComponents, componentToMove);
};

const findComponentById = (id, currentComponents) => {
  for (let component of currentComponents) {
    if (component.id === id) {
      return component;
    } else if (component.children && component.children.length > 0) {
      const result = findComponentById(id, component.children);
      if (result) return result;
    }
  }
  return null;
};

