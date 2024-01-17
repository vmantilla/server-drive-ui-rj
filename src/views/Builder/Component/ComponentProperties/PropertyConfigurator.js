import React from 'react';
import MiniHeaderWithProperties from './MiniHeaderWithProperties';

import HeaderProperties from '../Properties/HeaderProperties';
import FooterProperties from '../Properties/FooterProperties';
import FontProperties from '../Properties/FontProperties';
import StrokeProperties from '../Properties/StrokeProperties';
import FrameProperties from '../Properties/FrameProperties';
import AlignmentProperties from '../Properties/AlignmentProperties';
import ImageProperties from '../Properties/ImageProperties';
import RoundedCornerProperties from '../Properties/RoundedCornerProperties';
import MarginProperties from '../Properties/MarginProperties';
import BackgroundProperties from '../Properties/BackgroundProperties';
import RowProperties from '../Properties/RowProperties';
import ColumnProperties from '../Properties/ColumnProperties';
import TextProperties from '../Properties/TextProperties';
import DataSourceProperties from '../Properties/DataSourceProperties';

import FunctionNameProperties from '../PropertiesFunction/FunctionNameProperties';
import ConditionalProperties from '../PropertiesFunction/ConditionalProperties';
import LoopProperties from '../PropertiesFunction/LoopProperties';
import SwitchCaseProperties from '../PropertiesFunction/SwitchCaseProperties';
import CaseProperties from '../PropertiesFunction/CaseProperties';


function PropertyConfigurator({ possibleStates, selectedComponent, viewStates, handleChangeState, handleAddState, handleDeleteState, handleRetry }) {
  const propertyComponents = [
        {title: "Header", component: HeaderProperties},
        {title: "Footer", component: FooterProperties},
        {title: "Row", component: RowProperties},
        {title: "Column", component: ColumnProperties},
        {title: "Text", component: TextProperties},
        {title: "datasource", component: DataSourceProperties},
        {title: "Background", component: BackgroundProperties},
        {title: "Margin", component: MarginProperties},
        {title: "Corner", component: RoundedCornerProperties},
        {title: "Image", component: ImageProperties},
        {title: "Frame", component: FrameProperties},
        {title: "Alignment", component: AlignmentProperties},
        {title: "Font", component: FontProperties},
        {title: "Stroke", component: StrokeProperties},
        {title: "Function_Name", component: FunctionNameProperties},
        {title: "Function_Returns", component: FunctionNameProperties},
        {title: "Conditional", component: ConditionalProperties},
        {title: "Loop", component: LoopProperties},
        {title: "Switch", component: SwitchCaseProperties},
        {title: "Case", component: CaseProperties},
    ];

    const allowedPropertiesConfig = {
        header: ["Background", "Margin", "Corner", "Text"],
        body: ["Background", "Margin", "Corner", "Text"],
        footer: ["Background", "Margin", "Corner", "Text"],
        button: ["Frame", "Background", "Margin", "Corner", "Text", "Font", "Stroke"],
        row: ["Frame","Background", "Margin", "Corner"],
        column: ["Frame","Background", "Margin", "Corner"],
        image: ["Frame","Background", "Margin", "Corner", "Frame"],
        text: ["Frame","Text","Background", "Margin", "Corner", "Font", "Stroke"],
        inputtext: ["Frame","Text","Background", "Margin", "Corner", "Font", "Stroke"],
        onload: ["Function_Name", "Function_Returns"],
        conditional: ["Conditional"],
        loop: ["Loop"],
        switch: ["Switch"],
    	case: ["Case"],
    };

    const mainComponentType = selectedComponent?.sub_type;

  if (!allowedPropertiesConfig.hasOwnProperty(mainComponentType)) {
    console.warn('PropertyConfigurator: Tipo de componente no encontrado en la configuración.', mainComponentType);
    return null;
  }

  const allowedTitles = allowedPropertiesConfig[mainComponentType];
  const allowedProperties = propertyComponents.filter(({ title  }) => allowedTitles.includes(title));

  return allowedProperties.map(({ title, component }) => {
    return (
      <MiniHeaderWithProperties
        possibleStates={possibleStates}
        key={`${title}${selectedComponent.id}`}
        title={title}
        selectedComponent={component}
        states={viewStates[title.toLowerCase()]}
        propertyComponent={component}
        handleChangeState={handleChangeState}
        handleAddState={handleAddState}
        handleDeleteState={handleDeleteState}
        handleRetry={handleRetry}
      />
    );
  });
}

export default PropertyConfigurator;
