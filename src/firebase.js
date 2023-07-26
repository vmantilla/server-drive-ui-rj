import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDXmfuNVwKnYkeKY4xbN3MUk6Sutk6ZXU",
  authDomain: "builder-f7e80.firebaseapp.com",
  projectId: "builder-f7e80",
  storageBucket: "builder-f7e80.appspot.com",
  messagingSenderId: "1095746871398",
  appId: "1:1095746871398:web:ed8676f8b847eab1f60da7",
  measurementId: "G-5YE5W7Z120"
};

const app = initializeApp(firebaseConfig);
const firebase = getFirestore(app);

export { firebase };
