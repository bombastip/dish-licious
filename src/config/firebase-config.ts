import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyCMkF-jIdQ3egqehoZUXqePsmZdK7Nfobw',
    authDomain: 'dish-licous.firebaseapp.com',
    projectId: 'dish-licous',
    storageBucket: 'dish-licous.appspot.com',
    messagingSenderId: '17275476772',
    appId: '1:17275476772:web:507696febc6633c5e4f1b1',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
