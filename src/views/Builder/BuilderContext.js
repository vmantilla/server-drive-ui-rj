import React, { createContext, useContext, useState } from 'react';

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

  const resetBuilder = () => {
    setPreviews([]);
    setSelectedScreen(null);
    setComponents([]);
    setSelectedComponent(null);
    setUiScreens([]);
    setUiWidgets([]);
    setUiWidgetsProperties([]);
  };

  // Función para construir el árbol basado en un id de pantalla.
  const buildTree = (screenId) => {
    const screen = uiScreens[screenId];
    if (!screen) return null;

    const [_, widgetIds] = screen;

    const buildNode = (widgetId, parentId = null) => {
      const widget = uiWidgets[widgetId];
      if (!widget) return null;

      const [component_type, propertyIds, childIds] = widget;
      const children = childIds.map(childId => buildNode(childId, widgetId)).filter(Boolean); 

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
        children,
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
  };const getUpdateObject = () => {
    return {
        uiScreens: updateQueue.uiScreens.map(id => {
            const screen = uiScreens[id]; // {"8166ae14-e3ea-4527-9aa9-c8cdd0379531"=>["Chats List", [...], 28, 36]}
            return {
                id: id,
                title: screen[0],
                position_x: screen[2],
                position_y: screen[3]
            };
        }),
        uiWidgets: [],
        uiWidgetsProperties: updateQueue.uiWidgetsProperties.map(id => {
            const property = uiWidgetsProperties[id];
            return {
                id: id,
                name: property[0],
                data: property[1],
                platform: property[2]
            };
        }),
    };
};


  return (
    <BuilderContext.Provider
    value={{
      previews, setPreviews,
      uiScreens, setUiScreens,
      uiWidgets, setUiWidgets,
      uiWidgetsProperties, setUiWidgetsProperties,
      selectedScreen, setSelectedScreen,
      updateQueue, setUpdateQueue,
      shouldUpdate, setShouldUpdate,
      selectedComponent, setSelectedComponent,
      buildTree,
      recursiveDeleteComponent,
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
