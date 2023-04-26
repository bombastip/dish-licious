import "firebase/compat/firestore";
import { db } from "../config/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { User } from "firebase/auth";

export async function createUserCollection(user: User) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      email: user.email,
      username: "",
      photoURL:
        "https://i.pinimg.com/736x/70/a5/3b/70a53b8bba4940a182813f519fd543ca.jpg",
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
