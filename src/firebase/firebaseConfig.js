// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Storage removed: use Cloudinary for image uploads instead of Firebase Storage
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdUE9vA5isdt86WlDrFfDbYenqXETpME0",
  authDomain: "animalets-a042c.firebaseapp.com",
  projectId: "animalets-a042c",
  storageBucket: "animalets-a042c.appspot.com",
  messagingSenderId: "161692304454",
  appId: "1:161692304454:web:9cd7afd1c7fa3013ddb647",
  measurementId: "G-WJSBRYQ1JT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore with a development-friendly fallback to long-polling
// This avoids browser streaming (WebChannel) issues / CORS errors in some dev setups.
try {
  initializeFirestore(app, { experimentalForceLongPolling: true });
} catch (e) {
  // If initializeFirestore is called twice it'll throw; ignore safely
}

// Export Firestore database instance for use in the app
export const db = getFirestore(app);
// Export Firebase Auth instance
export const auth = getAuth(app);
// Note: Storage SDK removed from this project (Cloudinary used instead).
