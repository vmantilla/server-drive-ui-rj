import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const BuilderContext = createContext();

export const BuilderProvider = ({ children }) => {

  const [updateQueue, setUpdateQueue] = useState({
    uiScreens: [],
    uiWidgetsProperties: [],
    uiWidgetsActions: [],
  });

  const [shouldUpdate, setShouldUpdate] = useState(false);

  const [previews, setPreviews] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const [uiScreens, setUiScreens] = useState([]);
  const [uiWidgets, setUiWidgets] = useState([]);
  const [uiWidgetsProperties, setUiWidgetsProperties] = useState([]);
  const [uiWidgetsActions, setUiWidgetsActions] = useState([]);

  const uiScreensRef = useRef({});
  const uiWidgetsPropertiesRef = useRef({});
  const uiWidgetsActionsRef = useRef({});

  useEffect(() => {
    uiScreensRef.current = uiScreens;
  }, [uiScreens]);

  useEffect(() => {
    uiWidgetsPropertiesRef.current = uiWidgetsProperties;
  }, [uiWidgetsProperties]);

  useEffect(() => {
    uiWidgetsActionsRef.current = uiWidgetsActions;
  }, [uiWidgetsActions]);

  const resetBuilder = () => {
    setPreviews([]);
    setSelectedScreen(null);
    setComponents([]);
    setSelectedComponent(null);
    setUiScreens([]);
    setUiWidgets([]);
    setUiWidgetsProperties([]);
    setUiWidgetsActions([]);
  };



  const verifyDataConsistency = () => {
    let isConsistent = true;

    // Verificar la existencia de uiScreens, uiWidgets, uiWidgetsProperties, uiWidgetsActions en el estado local
    if (!uiScreens || !uiWidgets || !uiWidgetsProperties || !uiWidgetsActions) {
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
    Object.values(uiWidgets).forEach(([_, propertyIds, childIds, actionIds]) => {
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
        // Verificar acciones
        actionIds.forEach(actionId => {
            if (!uiWidgetsActions[actionId]) {
                console.error(`Inconsistencia encontrada: actionId ${actionId} referenciado en uiWidgets no existe en uiWidgetsActions.`);
                isConsistent = false;
            }
        });
    });

    // Verificar la consistencia de uiWidgetsActions
    Object.values(uiWidgetsActions).forEach(action => {
        if (!action[0]) {
            console.error(`Inconsistencia encontrada: una acción en uiWidgetsActions no tiene un tipo definido.`);
            isConsistent = false;
        }
    });
    
    return isConsistent;
}

 const buildTree = (screenId) => {
  const screen = uiScreens[screenId];
  if (!screen) return null;

  const { widgets: widgetIds } = screen;

  const buildNode = (widgetId, parentId = null) => {
    const widget = uiWidgets[widgetId];
    if (!widget) return null;

    const { type: component_type, props: propertyIds, children: childIds, actions: actionIds } = widget; 

    const children = childIds.map(childId => buildNode(childId, widgetId)).filter(Boolean);

    const actions = actionIds ? actionIds.map(actionId => {
      const action = uiWidgetsActions[actionId];
      if (!action) return null;
      const { type: action_type } = action;
      return {
        id: actionId,
        component_type: action_type,
        children: [],
        parent_id: parentId,
        entityType: 'action' // Aquí identificas que es una acción
      };
    }).filter(Boolean) : [];

    const properties = propertyIds.map(id => {
      const property = uiWidgetsProperties[id];
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
      id: widgetId,
      component_type,
      children: [...children, ...actions],
      properties,
      parent_id: parentId,
      entityType: 'widget' // Aquí identificas que es un widget
    };
  };

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


  const addWidgetWithProperties = (response) => {

    const { uiWidgets, uiWidgets_properties } = response;
    setUiWidgets((prev) => {
      const updated = { ...prev, ...response.uiWidgets };
      console.log(updated);
      return updated;
    });

    setUiWidgetsProperties((prev) => ({ ...prev, ...uiWidgets_properties }));
  };

  const addWidgetWithActions = (response) => {

    const { uiWidgets, uiWidgets_actions } = response;
    setUiWidgets((prev) => {
      const updated = { ...prev, ...response.uiWidgets };
      console.log(updated);
      return updated;
    });

    setUiWidgetsActions((prev) => ({ ...prev, ...uiWidgets_actions }));
  };

  // Recursivamente elimina los hijos y propiedades
  const recursiveDeleteComponent = (componentId) => {
    const widget = uiWidgets[componentId];
    if (!widget) return;
    
    const [_, propertyIds, childIds] = widget;
    
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




  return (
    <BuilderContext.Provider
    value={{
      previews, setPreviews,
      uiScreens, setUiScreens,
      uiWidgets, setUiWidgets,
      uiWidgetsProperties, setUiWidgetsProperties,
      uiWidgetsActions, setUiWidgetsActions,
      selectedScreen, setSelectedScreen,
      updateQueue, setUpdateQueue,
      shouldUpdate, setShouldUpdate,
      selectedComponent, setSelectedComponent,
      buildTree,
      recursiveDeleteComponent,
      addWidgetWithActions,
      addWidgetWithProperties,
      resetBuilder,
      verifyDataConsistency,
      findWidgetPropertiesById,
      updateSelectedComponentProperties,
      getUpdateObject,
      handleObjectChange,
      handleJSONUpdate
    }}
    >
    {children}
    </BuilderContext.Provider>
    );
  }

  export const useBuilder = () => {
    return useContext(BuilderContext);
  }
