// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // <-- BU SATIRI UNUTMAMALIYIZ

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAB7ahFCz5ddcXL56lU3JsofneU5ddeCe4",
  authDomain: "chattr-43fa5.firebaseapp.com",
  projectId: "chattr-43fa5",
  storageBucket: "chattr-43fa5.firebasestorage.app",
  messagingSenderId: "71423990789",
  appId: "1:71423990789:web:656b40b6407b53b4a8106c",
  measurementId: "G-J66D4HD22E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // <-- Auth servisini dışa aktarıyoruz ki AuthScreen kullanabilsin