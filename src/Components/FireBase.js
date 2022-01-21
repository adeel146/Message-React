// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeCDoqn0Q8kP_6I1P7CFX11RS8aF3wy2c",
  authDomain: "todo-4986e.firebaseapp.com",
  projectId: "todo-4986e",
  storageBucket: "todo-4986e.appspot.com",
  messagingSenderId: "904258489401",
  appId: "1:904258489401:web:efc581449f463aedc251e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
export default getFirestore();