import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase-app";
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
