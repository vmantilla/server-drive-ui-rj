// Archivo: renderComponentTree.js

import SDVStackView from '../models/components/SDVStackView';
import SDHStackView from '../models/components/SDHStackView';
import SDZStackView from '../models/components/SDZStackView';
import SDTextView from '../models/components/SDTextView';
import SDImageView from '../models/components/SDImageView';
import SDButtonView from '../models/components/SDButtonView';
import SDScrollView from '../models/components/SDScrollView';

export function renderComponentTree(component) {
	let Component;

	switch (component.type) {
	case "VStack":
		Component = SDVStackView
		break;
	case "HStack":
		Component = SDHStackView;
		break;
	case "ZStack":
		Component = SDZStackView;
		break;
	case "Text":
      Component = SDTextView; // Use a paragraph for Text components
      break;
  case "Button":
      Component = SDButtonView; // Use a button element for Button components
      break;
  case "Image":
      Component = SDImageView; // Use an img element for Image components
      break;
  case "TextField":
      Component = 'div'; // Use an input element for TextField components
      break;
  case "ScrollView":
      Component = SDScrollView; // Use a div for ScrollView components
      break;
  default:
     console.log(' Default to a div:', component.type); // Agrega un registro para indicar el componente actual

     
      Component = 'div'; // Default to a div
  }

  return (
  	<Component key={component.id} component={component}>
  	{component.childrens && component.childrens.length > 0 && component.childrens.map(renderComponentTree)}
  	</Component>
  	);
  }
