import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAj3Zezjr-8qsLY0jX28hi9QowuXrquUxk",
  authDomain: "aquasafe-18ae8.firebaseapp.com",
  projectId: "aquasafe-18ae8",
  storageBucket:"aquasafe-18ae8.firebasestorage.app",
  messagingSenderId: "596885355864",
  appId: "1:596885355864:web:febffcdcbcb8e1ba8cb92d",
  databaseURL: "https://aquasafe-18ae8-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
