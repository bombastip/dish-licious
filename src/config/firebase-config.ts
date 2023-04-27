import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCMkF-jIdQ3egqehoZUXqePsmZdK7Nfobw",
  authDomain: "dish-licous.firebaseapp.com",
  projectId: "dish-licous",
  storageBucket: "dish-licous.appspot.com",
  messagingSenderId: "17275476772",
  appId: "1:17275476772:web:507696febc6633c5e4f1b1",
};

export const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: "http://localhost:5173/authentication",
  handleCodeInApp: true,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
