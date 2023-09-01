class ComponentManager {
  constructor(previewId, initialData = []) {
    this.previewId = previewId;
    this.components = initialData;
  }

  static getDBKey(previewId) {
    return `components_${previewId}`;
  }

  deleteComponent(idToDelete) {
    this.components = this.deleteComponentRecursive(idToDelete, this.components);
    this.saveToDB();
  }

  deleteComponentRecursive(idToDelete, currentComponents) {
    return currentComponents.filter(comp => comp.id !== idToDelete).map(component => {
      const newComponent = { ...component };
      if (newComponent.children && newComponent.children.length > 0) {
        newComponent.children = this.deleteComponentRecursive(idToDelete, newComponent.children);
      }
      return newComponent;
    });
  }

  addComponentChild(parentId, child) {
    this.components = this.addComponentChildRecursive(parentId, this.components, child);
    this.saveToDB();
  }

  addComponentChildRecursive(parentId, currentComponents, child) {
    return currentComponents.map(component => {
      if (component.id === parentId) {
        return {
          ...component,
          children: [...(component.children || []), child],
          expanded: true 
        };
      } else if (component.children && component.children.length > 0) {
        return {
          ...component,
          children: this.addComponentChildRecursive(parentId, component.children, child)
        };
      }
      return component;
    });
  }

  removeComponent(componentId) {
    this.components = this.removeComponent(componentId, this.components);
    this.saveToDB();
  }

  removeComponent(componentId, currentComponents) {
    return currentComponents.reduce((acc, component) => {
      const newComponent = { ...component };
      if (newComponent.id !== componentId) {
        if (newComponent.children && newComponent.children.length) {
          newComponent.children = this.removeComponent(componentId, newComponent.children);
        }
        acc.push(newComponent);
      }
      return acc;
    }, []);
  }

  isDescendant(parentComponent, targetId) {
    if (parentComponent.children && Array.isArray(parentComponent.children)) {
      for (let child of parentComponent.children) {
        if (child.id === targetId || this.isDescendant(child, targetId)) {
          return true;
        }
      }
    }
    return false;
  }

  moveComponent(componentId, parentId) {
    if (componentId === parentId) {
      throw new Error('No se puede mover un componente dentro de sí mismo.');
    }

    const componentToMove = this.findComponentById(componentId);
    if (!componentToMove) {
      throw new Error(`No se encontró el componente con ID ${componentId}`);
    }

    if (this.isDescendant(componentToMove, parentId)) {
      throw new Error('No se puede mover un componente dentro de sí mismo o dentro de un descendiente.');
    }

    this.components = this.addComponentChildRecursive(parentId, this.removeComponent(componentId, this.components), componentToMove);
    this.saveToDB();
  }

  findComponentById(id) {
    for (let component of this.components) {
      if (component.id === id) {
        return component;
      } else if (component.children && component.children.length > 0) {
        const result = this.findComponentById(id, component.children);
        if (result) return result;
      }
    }
    return null;
  }

  saveToDB() {
    const key = ComponentManager.getDBKey(this.previewId);
    localStorage.setItem(key, JSON.stringify(this.components));
  }

  loadFromDB() {
    const key = ComponentManager.getDBKey(this.previewId);
    this.components = JSON.parse(localStorage.getItem(key)) || [];
  }
}

export default ComponentManager;
