// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR-API-KEY",
  authDomain: "hspantryapp-1a8d3.firebaseapp.com",
  projectId: "hspantryapp-1a8d3",
  storageBucket: "hspantryapp-1a8d3.appspot.com",
  messagingSenderId: "282059438315",
  appId: "1:282059438315:web:52dc22d17e92bcda6466ae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export{
    app,
    firestore
}
