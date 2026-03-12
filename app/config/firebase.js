
import { initializeApp } from "firebase/app"; // used to initialize new app in firebase
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7KlpG5r7WzztoY8uFheZlYcQTkAg0kCo", // TO-DO
  authDomain: "wics-tutorial.firebaseapp.com", // TO-DO
  projectId: "wics-tutorial", // TO-DO
  storageBucket: "wics-tutorial.firebasestorage.app",
  messagingSenderId: "565120634673",
  appId: "1:565120634673:web:b0ae9c69be5e0f71276a10",
  measurementId: "G-B1W0D30PJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // variable that connects our project with fb services
export const db = getFirestore(app);