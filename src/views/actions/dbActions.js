import { openDB } from 'idb';
import { firebase } from '../../firebase';
import { doc, setDoc } from "firebase/firestore";
import SDComponent from '../../models/structs/SDComponent';

// Definir la versión en una constante para asegurar que se use la misma en todas partes
const DB_VERSION = 2;

export const importComponentsFromJSON = async () => {
  // Solicita al usuario que cargue el archivo JSON
    const file = await new Promise((resolve) => {
      let fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'application/json';

      fileInput.onchange = (e) => {
        let file = e.target.files[0];
        resolve(file);
      };

      fileInput.click();
    });

  // Lee y analiza el archivo JSON
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let components = JSON.parse(e.target.result);
      
      // Muestra el contenido del archivo JSON en la consola
      console.log(components);
    };

    fileReader.readAsText(file);
};


export const deploy = async () => {
  try {
      const db = await openDB('builderDB', DB_VERSION);
      const components = await db.getAll('droppedComponentsStore');
      const dataStr = JSON.stringify(components);

      const docRef = doc(firebase, "users", "ravit-21");

      await setDoc(docRef, { dataStr }, { merge: true });
      console.log("Document updated with ID: ", docRef.id);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
};

export const exportComponentsToJSON = async (droppedComponents) => {
  const db = await openDB('builderDB', DB_VERSION);
    const components = await db.getAll('droppedComponentsStore');
    const dataStr = JSON.stringify(components);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
};


export const clearDroppedComponents = async (setDroppedComponents) => {
  const db = await openDB('builderDB', DB_VERSION);
  await db.clear('droppedComponentsStore');
  setDroppedComponents([]);
};

export const initDB = async (setDroppedComponents) => {
  const db = await openDB('builderDB', DB_VERSION, { // Cambia la versión a 2
    upgrade(db) {
      if (!db.objectStoreNames.contains('droppedComponentsStore')) { // Comprueba si ya existe
        db.createObjectStore('droppedComponentsStore'); // Crea la object store si no existe
      }
    },
  });
  const components = await db.getAll('droppedComponentsStore');
  setDroppedComponents(components.map(component => SDComponent.fromJSON(component)));
};

export const updateDB = async (droppedComponents) => {
  const db = await openDB('builderDB', DB_VERSION);
  for (let i = 0; i < droppedComponents.length; i++) {
    if (droppedComponents[i]) {
      if (typeof droppedComponents[i].toJSON === 'function') {
        await db.put('droppedComponentsStore', droppedComponents[i].toJSON(), i);
      } else {
        console.log(`droppedComponents[${i}] does not have a toJSON method`);
      }
    } else {
      console.log(`droppedComponents[${i}] is undefined or null`);
    }
  }
};
