import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const BuilderContext = createContext();

export const BuilderProvider = ({ children }) => {

  const [updateQueue, setUpdateQueue] = useState({
    uiScreens: [],
    uiWidgetsProperties: []
  });

  const [shouldUpdate, setShouldUpdate] = useState(false);

  const [previews, setPreviews] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const [uiScreens, setUiScreens] = useState([]);
  const [uiWidgets, setUiWidgets] = useState([]);
  const [uiWidgetsProperties, setUiWidgetsProperties] = useState([]);

  const uiScreensRef = useRef({});
  const uiWidgetsPropertiesRef = useRef({});

  useEffect(() => {
    uiScreensRef.current = uiScreens;
  }, [uiScreens]);

  useEffect(() => {
    uiWidgetsPropertiesRef.current = uiWidgetsProperties;
  }, [uiWidgetsProperties]);

  const resetBuilder = () => {
    setPreviews([]);
    setSelectedScreen(null);
    setComponents([]);
    setSelectedComponent(null);
    setUiScreens([]);
    setUiWidgets([]);
    setUiWidgetsProperties([]);
  };

  const verifyDataConsistency = () => {
    let isConsistent = true;

    // Verificar la existencia de uiScreens, uiWidgets, uiWidgetsProperties, uiWidgetsActions en el estado local
    if (!uiScreens || !uiWidgets || !uiWidgetsProperties ) {
        console.error("Faltan algunos campos necesarios en el estado local.");
        return false;
    }
    
    // Verificar la consistencia de uiScreens
    Object.values(uiScreens).forEach(([_, widgetIds]) => {
        widgetIds.forEach(widgetId => {
            if (!uiWidgets[widgetId]) {
                console.error(`Inconsistencia encontrada: widgetId ${widgetId} referenciado en uiScreens no existe en uiWidgets.`);
                isConsistent = false;
            }
        });
    });

    // Verificar la consistencia de uiWidgets
    Object.values(uiWidgets).forEach(([_, propertyIds, childIds]) => {
        // Verificar propiedades
        propertyIds.forEach(propertyId => {
            if (!uiWidgetsProperties[propertyId]) {
                console.error(`Inconsistencia encontrada: propertyId ${propertyId} referenciado en uiWidgets no existe en uiWidgetsProperties.`);
                isConsistent = false;
            }
        });
        // Verificar hijos
        childIds.forEach(childId => {
            if (!uiWidgets[childId]) {
                console.error(`Inconsistencia encontrada: childId ${childId} referenciado en uiWidgets no existe en uiWidgets.`);
                isConsistent = false;
            }
        });
    });

    
    return isConsistent;
}

 const buildTree = (screenId, userId, projectId) => {
  const screen = uiScreens[screenId];
  if (!screen) return null;

  const { widgets: widgetIds } = screen;

  const buildNode = (widgetId, parentId = null, position = 0) => {
    const widget = uiWidgets[widgetId];
    if (!widget) return null;

    const { name, props: propertyIds, children: childIds, sub_type } = widget;

    // Construyendo nodos hijos recursivamente
    const children = childIds.map((childId, index) => buildNode(childId, widgetId, index)).filter(Boolean);

    // Construyendo propiedades de los widgets
    const properties = propertyIds.map(id => {
      const property = uiWidgetsProperties[id];
      if (!property) return null;

      const { name, data, plat: platform } = property;
      return {
        id,
        name,
        data,
        platform
      };
    }).filter(Boolean);

    // Retornando la estructura del widget actual
    return {
      name,
      component_type: 0, // Asumiendo que el tipo es 0 para todos estos componentes
      sub_type: Component.sub_types[sub_type], // Asignando el subtipo utilizando el enum
      user_id: userId,
      project_id: projectId,
      position,
      children,
      properties,
    };
  };

  // Iniciar la construcción del árbol desde el ID de la pantalla proporcionado
  return buildNode(screenId);
};


 console.log(widgetIds.map(widgetId => buildNode(widgetId)).filter(Boolean))
  return widgetIds.map(widgetId => buildNode(widgetId)).filter(Boolean);
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

        uiWidgets: [],

        uiWidgetsProperties: (updateQueue.uiWidgetsProperties || []).map(id => {
            const property = uiWidgetsPropertiesRef.current[id];

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
        }).filter(Boolean),  // Filters out any null values

        uiWidgetsActions: (updateQueue.uiWidgetsActions || []).map(id => {
            const action = uiWidgetsActionsRef.current[id];

            if (!action) {
                return null;
            }

            const { type: action_type } = action;

            return {
                id: id,
                action_type: action_type || null
            };
        }).filter(Boolean)
    };
}

  const findWidgetPropertiesById = (widgetId) => {
    const widget = uiWidgets[widgetId];
    if (!widget) return null;

    const { props: propertyIds } = widget; 
      
    const properties = propertyIds.reduce((acc, id) => {
      const property = uiWidgetsProperties[id];
      if (property) acc[id] = property;
      return acc;
    }, {});

    return properties;
  }

  const findEntityById = (entityType, entityId) => {
    console.log("entityType", entityType)
    console.log("entityId", entityId)
  let entity;
  switch (entityType) {
    case 'widget':
      entity = uiWidgets[entityId];
      break;
    case 'screen':
      entity = uiScreens[entityId];
      break;
    case 'action':
      entity = uiWidgetsActions[entityId];
      break;
    case 'instruction':
      entity = uiWidgetsActionsInstructions[entityId];
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

    const updateOrAddWidget = (widget) => {
      setUiWidgets(prev => {
        return { ...prev, [widget.id]: widget };
      });
    };

    const updateOrAddWidgetProperty = (property) => {
      setUiWidgetsProperties(prev => {
        return { ...prev, [property.id]: property };
      });
    };

    const updateOrAddWidgetAction = (action) => {
      setUiWidgetsActions(prev => {
        return { ...prev, [action.id]: action };
      });
    };

    const updateOrAddWidgetActionInstructions = (instruction) => {
      
      setUiWidgetsActionsInstructions(prev => {
        return { ...prev, [instruction.id]: instruction };
      });
    };

    if (json.screens) {
      for (let screenId in json.screens) {
        updateOrAddScreen(json.screens[screenId]);
      }
    }

    if (json.widgets) {
      for (let widgetId in json.widgets) {
        updateOrAddWidget(json.widgets[widgetId]);
      }
    }

    if (json.props) {
      for (let propertyId in json.props) {
        updateOrAddWidgetProperty(json.props[propertyId]);
      }
    }

    if (json.actions) {
      for (let actionId in json.actions) {
        updateOrAddWidgetAction(json.actions[actionId]);
      }
    }
    if (json.instructions) {
      for (let instructionId in json.instructions) {
        updateOrAddWidgetActionInstructions(json.instructions[instructionId]);
      }
    }
  };

  const recursiveDeleteComponent = (componentId) => {
    const widget = uiWidgets[componentId];
    if (!widget) return;
    
    const { props: propertyIds, children: childIds } = widget;
    
    childIds.forEach(recursiveDeleteComponent);

    let updatedUiWidgetsProperties = { ...uiWidgetsProperties };
    propertyIds.forEach(id => {
      delete updatedUiWidgetsProperties[id];
    });
    setUiWidgetsProperties(updatedUiWidgetsProperties);

    let updatedUiWidgets = { ...uiWidgets };
    delete updatedUiWidgets[componentId];
    setUiWidgets(updatedUiWidgets);
  };

  const updateWidgetPropertiesAndActionsAndInstructions = (response) => {
    const { widgets, props, actions, instructions } = response;

    // Actualizar widgets
    setUiWidgets((prev) => {
      const updatedWidgets = { ...prev, ...widgets };
      return updatedWidgets;
    });

    // Si hay propiedades en la respuesta, actualizar el estado de propiedades
    if (props) {
      setUiWidgetsProperties((prev) => ({ ...prev, ...props }));
    }

    // Si hay acciones en la respuesta, actualizar el estado de acciones
    if (actions) {
      setUiWidgetsActions((prev) => ({ ...prev, ...actions }));
    }

    if (instructions) {
      setUiWidgetsActionsInstructions((prev) => ({ ...prev, ...instructions }));
    }
  };


  /* old methods */


  const updateSelectedComponentProperties = (widgetId, propertyIdsArray) => {
    const widget = uiWidgets[widgetId];

    if (!widget) {
      console.error("No se encuentra widgetId en uiWidgets, returning");
      return;
    }

    const [component_type, , childIds] = widget; // Asumo que la estructura es [component_type, propertyIds, childIds]

    let updatedProperties = [];

    propertyIdsArray.forEach(id => {
      const property = uiWidgetsProperties[id];
      if (property) updatedProperties.push(property);
    });

    const updatedWidget = [component_type, updatedProperties, childIds];
    
    let updatedUiWidgets = { ...uiWidgets, [widgetId]: updatedWidget };

    setUiWidgets(updatedUiWidgets);
  }

  return (
    <BuilderContext.Provider
    value={{
      previews, setPreviews,
      uiScreens, setUiScreens,
      uiWidgets, setUiWidgets,
      uiWidgetsProperties, setUiWidgetsProperties,
      uiWidgetsActions, setUiWidgetsActions,
      uiWidgetsActionsInstructions, setUiWidgetsActionsInstructions,
      selectedScreen, setSelectedScreen,
      updateQueue, setUpdateQueue,
      shouldUpdate, setShouldUpdate,
      selectedComponent, setSelectedComponent,
      buildTree,
      recursiveDeleteComponent,
      updateWidgetPropertiesAndActionsAndInstructions,
      resetBuilder,
      verifyDataConsistency,
      findWidgetPropertiesById,
      updateSelectedComponentProperties,
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
