import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const BuilderContext = createContext();

export const BuilderProvider = ({ children }) => {

  const [updateQueue, setUpdateQueue] = useState({
    uiScreens: [],
    uiComponentsProperties: []
  });

  const [shouldUpdate, setShouldUpdate] = useState(false);

  const [previews, setPreviews] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const [uiScreens, setUiScreens] = useState([]);
  const [uiComponents, setUiComponents] = useState([]);
  const [uiComponentsProperties, setUiComponentsProperties] = useState([]);

  const uiScreensRef = useRef({});
  const uiComponentsPropertiesRef = useRef({});

  useEffect(() => {
    uiScreensRef.current = uiScreens;
  }, [uiScreens]);

  useEffect(() => {
    uiComponentsPropertiesRef.current = uiComponentsProperties;
  }, [uiComponentsProperties]);

  const resetBuilder = () => {
    setPreviews([]);
    setSelectedScreen(null);
    setComponents([]);
    setSelectedComponent(null);
    setUiScreens([]);
    setUiComponents([]);
    setUiComponentsProperties([]);
  };

  const verifyDataConsistency = () => {
    let isConsistent = true;

    // Verificar la existencia de uiScreens, uiComponents, uiComponentsProperties
    if (!uiScreens || !uiComponents || !uiComponentsProperties ) {
        console.error("Faltan algunos campos necesarios en el estado local.");
        return false;
    }
    
    // Verificar la consistencia de uiScreens
    Object.values(uiScreens).forEach(([_, componentIds]) => {
        componentIds.forEach(componentId => {
            if (!uiComponents[componentId]) {
                console.error(`Inconsistencia encontrada: componentId ${componentId} referenciado en uiScreens no existe en uiComponents.`);
                isConsistent = false;
            }
        });
    });

    // Verificar la consistencia de uiComponents
    Object.values(uiComponents).forEach(([_, propertyIds, childIds]) => {
        // Verificar propiedades
        propertyIds.forEach(propertyId => {
            if (!uiComponentsProperties[propertyId]) {
                console.error(`Inconsistencia encontrada: propertyId ${propertyId} referenciado en uiComponents no existe en uiComponentsProperties.`);
                isConsistent = false;
            }
        });
        // Verificar hijos
        childIds.forEach(childId => {
            if (!uiComponents[childId]) {
                console.error(`Inconsistencia encontrada: childId ${childId} referenciado en uiComponents no existe en uiComponents.`);
                isConsistent = false;
            }
        });
    });

    
    return isConsistent;
}

  const buildTree = (screenId) => {
    const screen = uiScreens[screenId];
    if (!screen) return null;

    const { components: componentIds } = screen;

    const buildNode = (componentId, parentId = null) => {
      const component = uiComponents[componentId];
      if (!component) return null;

      const { name, component_type, props: propertyIds, children: childIds, sub_type } = component;
      const children = childIds.map(childId => buildNode(childId, componentId)).filter(Boolean); 

      const properties = propertyIds.map(id => {
        const property = uiComponentsProperties[id];
        if (!property) return null;

        const { name, data, plat: platform } = property;
        return {
          id,
          name,
          data,
          platform
        }
      }).filter(Boolean);

      return {
        id: componentId,
        name,
        component_type: component_type,
        sub_type: sub_type, 
        children,
        properties,
        parent_id: parentId 
      };
    };

    return componentIds.map(componentId => buildNode(componentId)).filter(Boolean); 
  };

  const handleObjectChange = (type, id) => {
    setUpdateQueue(prev => {
      if (!prev[type].includes(id)) {
        return { ...prev, [type]: [...prev[type], id] }
      }
      return prev;
    });
    console.log("setShouldUpdate")
    setShouldUpdate(true)
  };

  function getUpdateObject() {
    return {
        uiScreens: (updateQueue.uiScreens || []).map(id => {
            const screen = uiScreensRef.current[id];

            if (!screen) { // Check if screen is undefined or null
                return null;
            }

            const { title, x: position_x, y: position_y } = screen;

            return {
                id: id,
                title: title || null,
                position_x: position_x || null,
                position_y: position_y || null
            };
        }).filter(Boolean),

        uiComponents: [],

        uiComponentsProperties: (updateQueue.uiComponentsProperties || []).map(id => {
            const property = uiComponentsPropertiesRef.current[id];

            if (!property) { 
                return null;
            }

            const { name, data: propertyData, plat: platform } = property;

            return {
                id: id,
                name: name || null,
                data: propertyData,
                platform: platform || null
            };
        }).filter(Boolean),  
    };
}

  const findcomponentPropertiesById = (componentId) => {
    const component = uiComponents[componentId];
    if (!component) return null;

    const { props: propertyIds } = component; 
      
    const properties = propertyIds.reduce((acc, id) => {
      const property = uiComponentsProperties[id];
      if (property) acc[id] = property;
      return acc;
    }, {});

    return properties;
  }

  const findEntityById = (sub_type, entityId) => {
    console.log("sub_type", sub_type)
    console.log("entityId", entityId)
  let entity;
  switch (sub_type) {
    case 'widget':
      entity = uiComponents[entityId];
      break;
    case 'screen':
      entity = uiScreens[entityId];
      break;
    default:
      console.error("Tipo de entidad desconocido");
      return null;
  }

  if (!entity) return null;
  return entity;
};


  const handleJSONUpdate = (json) => {
    const updateOrAddScreen = (screen) => {
      setUiScreens(prev => {
        return { ...prev, [screen.id]: screen };
      });
    };

    const updateOrAddcomponent = (component) => {
      setUiComponents(prev => {
        return { ...prev, [component.id]: component };
      });
    };

    const updateOrAddcomponentProperty = (property) => {
      setUiComponentsProperties(prev => {
        return { ...prev, [property.id]: property };
      });
    };

    if (json.screens) {
      for (let screenId in json.screens) {
        updateOrAddScreen(json.screens[screenId]);
      }
    }

    if (json.components) {
      for (let componentId in json.components) {
        updateOrAddcomponent(json.components[componentId]);
      }
    }

    if (json.props) {
      for (let propertyId in json.props) {
        updateOrAddcomponentProperty(json.props[propertyId]);
      }
    }
  };

  const recursiveDeleteComponent = (componentId) => {
    const component = uiComponents[componentId];
    if (!component) return;
    
    const { props: propertyIds, children: childIds } = component;
    
    childIds.forEach(recursiveDeleteComponent);

    let updateduiComponentsProperties = { ...uiComponentsProperties };
    propertyIds.forEach(id => {
      delete updateduiComponentsProperties[id];
    });
    setUiComponentsProperties(updateduiComponentsProperties);

    let updateduiComponents = { ...uiComponents };
    delete updateduiComponents[componentId];
    setUiComponents(updateduiComponents);
  };

  const updatecomponentProperties = (response) => {
    const { components, props } = response;

    // Actualizar components
    setUiComponents((prev) => {
      const updatedcomponents = { ...prev, ...components };
      return updatedcomponents;
    });

    // Si hay propiedades en la respuesta, actualizar el estado de propiedades
    if (props) {
      setUiComponentsProperties((prev) => ({ ...prev, ...props }));
    }

  };


  return (
    <BuilderContext.Provider
    value={{
      previews, setPreviews,
      uiScreens, setUiScreens,
      uiComponents, setUiComponents,
      uiComponentsProperties, setUiComponentsProperties,
      selectedScreen, setSelectedScreen,
      updateQueue, setUpdateQueue,
      shouldUpdate, setShouldUpdate,
      selectedComponent, setSelectedComponent,
      buildTree,
      recursiveDeleteComponent,
      updatecomponentProperties,
      resetBuilder,
      verifyDataConsistency,
      findcomponentPropertiesById,
      getUpdateObject,
      handleObjectChange,
      handleJSONUpdate,
      findEntityById
    }}
    >
    {children}
    </BuilderContext.Provider>
    );
  }

  export const useBuilder = () => {
    return useContext(BuilderContext);
  }
