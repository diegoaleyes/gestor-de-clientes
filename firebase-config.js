import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyAywFYeyp7075nwvPRwgbDOrsDGuTEw8FQ",
  authDomain:        "peluqueria-diego.firebaseapp.com",
  projectId:         "peluqueria-diego",
  storageBucket:     "peluqueria-diego.firebasestorage.app",
  messagingSenderId: "361881711186",
  appId:             "1:361881711186:web:bed809744162911c5da58b",
  measurementId:     "G-00MCHQXPQE"
};

console.log('Firebase config cargada:', firebaseConfig);

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
