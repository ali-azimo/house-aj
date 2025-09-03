// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIRE,
    authDomain: "imo-project-21187.firebaseapp.com",
    projectId: "imo-project-21187",
    storageBucket: "imo-project-21187.appspot.com",
    messagingSenderId: "1082761372220",
    appId: "1:1082761372220:web:77325240177a4b7c2bd939"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);