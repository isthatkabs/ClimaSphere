import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZh72ec7IBUDrLvl3dPDgu0PCRpIl4r8M",
  authDomain: "climasphere-48k9.firebaseapp.com",
  projectId: "climasphere-48k9",
  storageBucket: "climasphere-48k9.firebasestorage.app",
  messagingSenderId: "224599303699",
  appId: "1:224599303699:web:8f8e62fa0b75020c6b81e6",
  measurementId: "G-GBDF49Q6MG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;
