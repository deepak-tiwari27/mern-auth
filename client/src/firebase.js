// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-1bb36.firebaseapp.com",
  projectId: "mern-auth-1bb36",
  storageBucket: "mern-auth-1bb36.appspot.com",
  messagingSenderId: "631187385895",
  appId: "1:631187385895:web:4dffe2209b7c0b7128a802"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);