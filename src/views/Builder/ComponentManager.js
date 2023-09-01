const TTL = 20000; // 60 seconds to load from api.

class ComponentManager {
  constructor(previewId) {
    this.previewId = previewId;
  }

  static getDBKey(previewId) {
    return `components_${previewId}`;
  }

  static getLastUpdatedKey(previewId) {
    return `lastUpdated_${previewId}`;
  }

  static getLastApiUpdatedKey(previewId) {
  	return `lastComponentApiUpdated`;
  }

  get components() {
  	return JSON.parse(localStorage.getItem(ComponentManager.getDBKey(this.previewId))) || [];
  }

  set components(data) {
  	localStorage.setItem(ComponentManager.getDBKey(this.previewId), JSON.stringify(data));
  }

  isUpdateRequired() {
  	const now = Date.now();
    const lastUpdatedKey = ComponentManager.getLastUpdatedKey(this.previewId);
    const lastUpdated = parseInt(localStorage.getItem(lastUpdatedKey)) || null;
    return (!lastUpdated || (now - lastUpdated > TTL))
  }

  saveLastUpdatedTime() {
  	const lastUpdatedKey = ComponentManager.getLastUpdatedKey(this.previewId);
    localStorage.setItem(lastUpdatedKey, Date.now().toString());
  }


  #findComponentByIdRecursive(id) {
    for (let component of this.components) {
      if (component.id === id) {
        return component;
      } else if (component.children && component.children.length > 0) {
        const result = this.#findComponentByIdRecursive(id, component.children);
        if (result) return result;
      }
    }
    return null;
  }
  
  addComponentChild(parentId, child) {
    this.components = this.#addComponentChildRecursive(parentId, this.components, child);
    this.saveToDB();
  }

  #addComponentChildRecursive(parentId, currentComponents, child) {
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
          children: this.#addComponentChildRecursive(parentId, component.children, child)
        };
      }
      return component;
    });
  }

  removeComponent(componentId) {
    this.components = this.#removeComponentRecursive(componentId, this.components);
    this.saveToDB();
  }

  #removeComponentRecursive(componentId, currentComponents) {
    return currentComponents.reduce((acc, component) => {
      const newComponent = { ...component };
      if (newComponent.id !== componentId) {
        if (newComponent.children && newComponent.children.length) {
          newComponent.children = this.#removeComponentRecursive(componentId, newComponent.children);
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

    const componentToMove = this.#findComponentByIdRecursive(componentId);
    if (!componentToMove) {
      throw new Error(`No se encontró el componente con ID ${componentId}`);
    }

    if (this.isDescendant(componentToMove, parentId)) {
      throw new Error('No se puede mover un componente dentro de sí mismo o dentro de un descendiente.');
    }

    this.components = this.#addComponentChildRecursive(parentId, this.removeComponent(componentId, this.components), componentToMove);
    this.saveToDB();
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
