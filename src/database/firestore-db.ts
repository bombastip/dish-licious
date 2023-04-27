import "firebase/compat/firestore";
import { db } from "../config/firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";

export async function createUserCollection(user: User) {
  const docRef = doc(db, "users", user.uid);
  const data = {
    username: "",
    photoURL: "https://icon-library.com/images/2693a2979d_91160.png",
  };
  setDoc(docRef, data)
    .then(() => {
      console.log("User written with ID: ", user.uid);
    })
    .catch((error) => {
      console.log(error);
    });
}
