import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAgzyo-_1l_PFD0fxl1DXsmK9Ct4t3mb2c",
    authDomain: "dish-licious.firebaseapp.com",
    projectId: "dish-licious",
    storageBucket: "dish-licious.appspot.com",
    messagingSenderId: "245027540950",
    appId: "1:245027540950:web:fb87abae77c500c4ec1e77",
    measurementId: "G-F1690LWF5M"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


