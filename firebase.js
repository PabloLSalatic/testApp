// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDpuKee2emetDs-fby5TfKA2nSXBFX50HY",
  authDomain: "apptesting-fce80.firebaseapp.com",
  projectId: "apptesting-fce80",
  storageBucket: "apptesting-fce80.appspot.com",
  messagingSenderId: "286940366311",
  appId: "1:286940366311:web:1e4f2689f0fac9a6ed2942",
  measurementId: "G-MLRE2M7QLN",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
