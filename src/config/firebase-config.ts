import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
    apiKey: 'AIzaSyAjD-agitq7bjctgnE5JwJbs4q3M3F_lyA',

    authDomain: 'dish-licious-ec16a.firebaseapp.com',

    projectId: 'dish-licious-ec16a',

    storageBucket: 'dish-licious-ec16a.appspot.com',

    messagingSenderId: '96006170974',

    appId: '1:96006170974:web:d10cb2912d99868dd347cf',

    measurementId: 'G-B84HWK1BL2',
};

export const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'http://localhost:5173/',
    handleCodeInApp: true,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
