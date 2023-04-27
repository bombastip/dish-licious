import { redirect } from "react-router-dom";
import { auth } from "../config/firebase-config";

const user = auth.currentUser;

export const authLoader = async () => {
  if (!user) {
    return redirect("/authentication");
  }
  return null;
};

export const signOutLoader = async () => {
  if (user) {
    return redirect("/");
  }
  return null;
};
