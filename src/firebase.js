// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdF649r4OpMh78KbgPz5AIRFa65gO39so",
  authDomain: "reminder-todo-app.firebaseapp.com",
  projectId: "reminder-todo-app",
  storageBucket: "reminder-todo-app.firebasestorage.app",
  messagingSenderId: "762678361749",
  appId: "1:762678361749:web:d69888f21afe946cad259c",
  measurementId: "G-WCX20087W5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
