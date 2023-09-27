import React, { createContext, useContext, useState } from 'react';

const BuilderContext = createContext();

export const BuilderProvider = ({ children }) => {
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


  return (
    <BuilderContext.Provider
      value={{
        previews, setPreviews,
        uiScreens, setUiScreens,
        uiWidgets, setUiWidgets,
        uiWidgetsProperties, setUiWidgetsProperties,
        selectedScreen, setSelectedScreen,
        components, setComponents,
        selectedComponent, setSelectedComponent,
        buildTree,
        recursiveDeleteComponent,
        addWidgetWithProperties,
        resetBuilder,
        verifyDataConsistency
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export const useBuilder = () => {
  return useContext(BuilderContext);
}
