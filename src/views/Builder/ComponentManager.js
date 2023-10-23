const TTL = 10000; 

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


	addComponentChild(parentId, child, position = null) {
		this.components = this.#addComponentChildRecursive(parentId, this.components, child, position = position);
		this.saveToDB();
	}

	removeComponent(componentId) {
		this.components = this.#removeComponentRecursive(componentId, this.components);
		this.#removeFromUpdateQueue(componentId);
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

	moveComponent(componentId, parentId, position = null) {
		if (componentId === parentId) {
			throw new Error('No se puede mover un componente dentro de sí mismo.');
		}

		const componentToMove = this.findComponentByIdRecursive(componentId, this.components);
		if (!componentToMove) {
			throw new Error(`No se encontró el componente con ID ${componentId}`);
		}

		if (this.isDescendant(componentToMove, parentId)) {
			throw new Error('No se puede mover un componente dentro de sí mismo o dentro de un descendiente.');
		}

		this.components = this.#addComponentChildRecursive(parentId, this.removeComponent(componentId, this.components), componentToMove, position);
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

	  
	  const component = this.findComponentByIdRecursive(id);
	  if (!component) {
	    throw new Error(`No se encontró el componente con ID ${id}`);
	  }

	  if (!component.properties) {
	    throw new Error(`No se encontraron las propiedades de ${id}`);
	  }

	  component.properties = newProperties;
	  console.log("newProperties", newProperties)
	  

	  const newComponents = this.updateComponentInTree(component);
	  if (!newComponents) {
	    throw new Error(`Error al actualizar el componente con ID ${id}`);
	  }

	  this.components = newComponents;
	  setTimeout(() => {
        this.saveToDB();
      }, 100);
	}

  //PRIVATE METHODS

	#removeFromUpdateQueue(componentId) {
	  this.updateQueue = this.updateQueue.filter(update => update.component_id !== componentId);
	  localStorage.setItem("updateQueue", JSON.stringify(this.updateQueue));
	}

	findComponentByIdRecursive(id, currentComponents = this.components, parentArray = null) {
	    for (let i = 0; i < currentComponents.length; i++) {
	        const component = currentComponents[i];
	        if (component.id === id) {
	        	component.position = i;
	            return component;
	        } else if (component.children && component.children.length > 0) {
	            const result = this.findComponentByIdRecursive(id, component.children, currentComponents);
	            if (result) return result;
	        }
	    }
	    return null;
	}

	#addComponentChildRecursive(parentId, currentComponents, child, position = null) {
		return currentComponents.map(component => {
			if (component.id === parentId) {
				const newChildren = [...(component.children || [])];
				newChildren.parent_id = parentId;
				if (position !== null) {
					newChildren.splice(position, 0, child); 
				} else {
					newChildren.push(child); 
				}
				return {
					...component,
					children: newChildren,
					expanded: true 
				};
			} else if (component.children && component.children.length > 0) {
				return {
					...component,
					children: this.#addComponentChildRecursive(parentId, component.children, child, position)
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

	updateComponentInTree(updatedComponent, currentComponents = this.components) {
		for (let i = 0; i < currentComponents.length; i++) {
			if (currentComponents[i].id === updatedComponent.id) {
				currentComponents[i] = updatedComponent;
				return currentComponents;
			}
			if (currentComponents[i].children && currentComponents[i].children.length > 0) {
				if (this.updateComponentInTree(updatedComponent, currentComponents[i].children)) {
					return currentComponents;
				}
			}
		}
		return null;
	}

	convertJsonToTree(jsonData, parent_id = null) {
	  const nodes = {};
	  
	  // Primero, crea todos los nodos.
	  for (const [id, value] of Object.entries(jsonData.uiComponents)) {
	    const [component_type, propertiesIds, children] = value;
	    nodes[id] = {
	      id,
	      component_type,
	      parent_id: parent_id, 
	      children: [],
	      properties: propertiesIds.map(propId => {
	        const property = jsonData.uiComponents_properties[propId];
	        return {
	          id: propId,
	          name: property[0], 
	          data: property[1], 
	          platform: property[2],
	        };
	      }) || [] 
	    };
	  }

	  // Segundo, añade los hijos a sus respectivos padres y actualiza el parent_id de los hijos.
	  for (const [id, value] of Object.entries(jsonData.uiComponents)) {
	    const [_, propertiesIds, children] = value;
	    
	    children.forEach((childId) => {
	      nodes[id].children.push(nodes[childId]);
	      nodes[childId].parent_id = id; 
	    });
	  }

	  // Tercero, encuentra los nodos raíz.
	  const roots = Object.values(nodes).filter(node => {
	    return !Object.values(nodes).some(otherNode =>
	      otherNode.children.some(child => child.id === node.id)
	    );
	  });

	  return roots;
	}



}


export default ComponentManager;
