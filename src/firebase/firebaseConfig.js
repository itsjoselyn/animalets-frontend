// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdUE9vA5isdt86WlDrFfDbYenqXETpME0",
  authDomain: "animalets-a042c.firebaseapp.com",
  projectId: "animalets-a042c",
  storageBucket: "animalets-a042c.firebasestorage.app",
  messagingSenderId: "161692304454",
  appId: "1:161692304454:web:9cd7afd1c7fa3013ddb647",
  measurementId: "G-WJSBRYQ1JT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firestore database instance for use in the app
export const db = getFirestore(app);