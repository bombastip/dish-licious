import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
    apiKey: 'AIzaSyBdaoI40WmGw_hXVQq6eu0I5tKnWowAHwQ',
    authDomain: 'dish-liciouss.web.app',
    projectId: 'dish-liciouss',
    storageBucket: 'kiouss.appspot.com',
    messagingSenderId: '660093546283',
    appId: '1:660093546283:web:a7c32c60df9e947cad5f6e',
};

export const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://dish-liciouss.web.app/login',
    handleCodeInApp: true,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
