import SDComponent from '../models/structs/SDComponent';
import SDProperties from '../models/structs/SDProperties';
import { openDB } from 'idb';
import SDComponentType from '../enums/SDComponentType';
import { getDefaultProps, getDefaultTextViewProperties } from './components/GetDefaultProps';
import { v4 as uuidv4 } from 'uuid';

export const deleteNestedComponent = (components, targetId) => {
    return components.flatMap(component => {
      if (component.id === targetId) {
      // Si el componente actual es el que se va a eliminar, retorna un array vacío para que no se incluya en los resultados.
        return [];
      } else if (component.children) {
      // Crear un nuevo componente con los children actualizados
        const updatedComponent = new SDComponent(
          component.id,
          component.sub_type,
          component.properties,
        deleteNestedComponent(component.children, targetId), // Elimina los hijos
        component.states,
        component.order
        );

        return [updatedComponent];
      } else {
        return [component];
      }
    });
  };

export const handleAddComponent = (type) => {
    const componentChildren = [];
    if (type === SDComponentType.Button) {
      componentChildren.push(new SDComponent(uuidv4(), SDComponentType.Object, getDefaultTextViewProperties(), [], {}));
    }
    const newComponent = new SDComponent(uuidv4(), type, getDefaultProps(type), componentChildren, {});
    setDroppedComponents(prevComponents => {
      const addComponentToSelected = (comp) => { if (comp.id === selectedComponent.id) comp.children.push(newComponent); comp.children.forEach(addComponentToSelected); };
      let newComponents = [...prevComponents]; newComponents.forEach(addComponentToSelected); return newComponents;
    });
  };

export const handleDeleteComponent = (componentId) => {
  if (window.confirm("¿Estás seguro de que quieres eliminar este componente?")) {
    deleteComponent(componentId);
  }
};

  const deleteComponent = (componentId) => {
    console.log("handleDeleteComponent",componentId)
    const nestedComponentToDelete = deleteNestedComponent(droppedComponents, componentId)
    setDroppedComponents(nestedComponentToDelete);
  };

// Otros manejadores de componentes pueden ir aquí...
