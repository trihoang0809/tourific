import { auth } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  UserCredential,
} from "firebase/auth";
import { storeToken } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerWithEmail = async (
  email: string,
  password: string,
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const token = await userCredential.user.getIdToken();
  await storeToken(token); // Store the token
  return userCredential;
};

export const loginWithEmail = async (
  email: string,
  password: string,
): Promise<UserCredential> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const token = await userCredential.user.getIdToken();
  await storeToken(token); // Store the token
  return userCredential;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
  await AsyncStorage.removeItem("userToken"); // Remove the token
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  return await firebaseSendPasswordResetEmail(auth, email);
};
