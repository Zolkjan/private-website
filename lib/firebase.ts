import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { firebaseApp } from "@/lib/firebase-app";

export { adminUid, isFirebaseConfigured } from "@/lib/firebase-app";
export { db } from "@/lib/firebase-public";
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const storage = firebaseApp ? getStorage(firebaseApp) : null;
