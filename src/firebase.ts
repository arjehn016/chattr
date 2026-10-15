import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Kendi Firebase yapılandırma bilgilerin
const firebaseConfig = {
  apiKey: "SENIN_API_KEY",
  authDomain: "SENIN_AUTH_DOMAIN",
  projectId: "SENIN_PROJECT_ID",
  storageBucket: "SENIN_STORAGE_BUCKET",
  messagingSenderId: "SENIN_MESSAGING_SENDER_ID",
  appId: "SENIN_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore veritabanını dışarı aktardık