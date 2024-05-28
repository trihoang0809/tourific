// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiIezHgUuLRgW-DkkDax7vhdBxBMB35d8",
  authDomain: "tourific-51d82.firebaseapp.com",
  projectId: "tourific-51d82",
  storageBucket: "tourific-51d82.appspot.com",
  messagingSenderId: "575767153823",
  appId: "1:575767153823:web:a5f35a78cebdc04338e6aa",
  measurementId: "G-4Q1ZEJG9KM",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
