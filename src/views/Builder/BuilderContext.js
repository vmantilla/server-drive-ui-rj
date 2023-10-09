import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const BuilderContext = createContext();

export const BuilderProvider = ({ children }) => {

  const [updateQueue, setUpdateQueue] = useState({
    uiScreens: [],
    uiWidgetsProperties: [],
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
    setUiWidgetsActions([]);
  };

  const buildTree = (screenId) => {
  const screen = uiScreens[screenId];
  if (!screen) return null;

  const [_, widgetIds] = screen;

  const buildNode = (widgetId, parentId = null) => {
    const widget = uiWidgets[widgetId];
    if (!widget) return null;

    const [component_type, propertyIds, childIds, actionIds] = widget; 
    const children = childIds.map(childId => buildNode(childId, widgetId)).filter(Boolean);

    const actions = actionIds ? actionIds.map(actionId => {
      const action = uiWidgetsActions[actionId];
      if (!action) return null;
      const [action_type] = action;
      return {
        id: actionId,
        component_type: action_type,
        children: [],
        parent_id: parentId,
      };
    }).filter(Boolean) : [];

    console.log(actions)

    const properties = propertyIds.map(id => {
      const property = uiWidgetsProperties[id];
      if (!property) return null;

      const [name, data, platform] = property;
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
      children: [...children, ...actions],  // combinar children y actions
      properties,
      parent_id: parentId
    };
  };

  return widgetIds.map(widgetId => buildNode(widgetId)).filter(Boolean);
};


  const findWidgetPropertiesById = (widgetId) => {
    const widget = uiWidgets[widgetId];
    if (!widget) return null;

    const [, propertyIds] = widget;
    
    const properties = propertyIds.reduce((acc, id) => {
      const property = uiWidgetsProperties[id];
      if (property) acc[id] = property;
      return acc;
    }, {});

    return properties;
  }

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

  const verifyDataConsistency = (uiScreens, uiWidgets, uiWidgetsProperties) => {
    let isConsistent = true;
    
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

  const handleObjectChange = (type, id) => {
    setUpdateQueue(prev => {
      if (!prev[type].includes(id)) {
        return { ...prev, [type]: [...prev[type], id] }
      }
      return prev;
    });
    setShouldUpdate(true)
  };

  function getUpdateObject() {
        return {
            uiScreens: updateQueue.uiScreens.map(id => {
                const screen = uiScreensRef.current[id];

                if (!screen) { // Check if screen is undefined or null
                    return null;
                }

                return {
                    id: id,
                    title: screen[0] || null,
                    position_x: screen[2] || null,
                    position_y: screen[3] || null
                };
            }).filter(Boolean),

            uiWidgets: [],

            uiWidgetsProperties: updateQueue.uiWidgetsProperties.map(id => {
                const property = uiWidgetsPropertiesRef.current[id];

                if (!property) { 
                    return null;
                }

                let propertyData = property[1];
                let virtualImage;

                const returnObj = {
                    id: id,
                    name: property[0] || null,
                    data: propertyData,
                    platform: property[2] || null
                };

                if (virtualImage) {
                    returnObj.virtual_image = virtualImage;
                }

                return returnObj;
            }).filter(Boolean),  // Filters out any null values
        };
    }


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
      handleObjectChange
    }}
    >
    {children}
    </BuilderContext.Provider>
    );
  }

  export const useBuilder = () => {
    return useContext(BuilderContext);
  }
