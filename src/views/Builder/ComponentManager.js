const TTL = 600; // 60 seconds to load from api.

class ComponentManager {
	constructor(previewId) {
		this.previewId = previewId;
		this.updateQueue = [];
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

	clearUpdateQueue() {
	  this.updateQueue = [];
	  localStorage.setItem("updateQueue", JSON.stringify(this.updateQueue));
	}

	getUpdateQueue() {
	  return JSON.parse(localStorage.getItem("updateQueue")) || [];
	}

	clearUpdateQueue() {
	  this.updateQueue = [];
	  localStorage.setItem("updateQueue", JSON.stringify(this.updateQueue));
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


	addComponentChild(parentId, child) {
		this.components = this.#addComponentChildRecursive(parentId, this.components, child);
		this.saveToDB();
	}

	removeComponent(componentId) {
		this.components = this.#removeComponentRecursive(componentId, this.components);
		this.saveToDB();
		return this.components
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

		const componentToMove = this.#findComponentByIdRecursive(componentId, this.components);
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
		localStorage.setItem("updateQueue", JSON.stringify(this.updateQueue));
	}

	loadFromDB() {
		const key = ComponentManager.getDBKey(this.previewId);
		this.components = JSON.parse(localStorage.getItem(key)) || [];
		this.updateQueue = JSON.parse(localStorage.getItem("updateQueue")) || [];
	}

	updateComponentProperties(id, newProperties) {
	  const component = this.#findComponentByIdRecursive(id);
	  if (!component) {
	    throw new Error(`No se encontró el componente con ID ${id}`);
	  }

	  if (!component.property.data) {
	    throw new Error(`No se encontró el componente con ID ${id}`);
	  }

	  if (this.deepEqual(component.property.data, newProperties)) {
	    return;
	  }

	  component.property.data = { ...component.property.data, ...newProperties };

	  const newComponents = this.#updateComponentInTree(component);
	  if (!newComponents) {
	    throw new Error(`Error al actualizar el componente con ID ${id}`);
	  }

	  this.components = newComponents;
	  this.updateQueue.push({component_id: id, property: newProperties});
	  this.saveToDB();
	}


  //PRIVATE METHODS

	#findComponentByIdRecursive(id, currentComponents = this.components) {
		for (let component of currentComponents) {
			if (component.id === id) {
				return component;
			} else if (component.children && component.children.length > 0) {
				const result = this.#findComponentByIdRecursive(id, component.children);
				if (result) return result;
			}
		}
		return null;
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

	#updateComponentInTree(updatedComponent, currentComponents = this.components) {
		for (let i = 0; i < currentComponents.length; i++) {
			if (currentComponents[i].id === updatedComponent.id) {
				currentComponents[i] = updatedComponent;
				return currentComponents;
			}
			if (currentComponents[i].children && currentComponents[i].children.length > 0) {
				if (this.#updateComponentInTree(updatedComponent, currentComponents[i].children)) {
					return currentComponents;
				}
			}
		}
		return null;
	}

	deepEqual(obj1, obj2) {
	  if (obj1 === obj2) return true;

	  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
	    return false;
	  }

	  const keys1 = Object.keys(obj1);
	  const keys2 = Object.keys(obj2);

	  if (keys1.length !== keys2.length) return false;

	  for (const key of keys1) {
	    if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) {
	      return false;
	    }
	  }

  return true;
}
}


export default ComponentManager;
