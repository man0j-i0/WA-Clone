import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyCYQUwbvCMTeDAffYtr7PvGGk00pa2sqJ8",
  authDomain: "wa-clone-5412d.firebaseapp.com",
  projectId: "wa-clone-5412d",
  storageBucket: "wa-clone-5412d.appspot.com",
  messagingSenderId: "130953297802",
  appId: "1:130953297802:web:0d6f643c3c15e1d5a69273"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();
const storage = getStorage();

export { auth, db, storage }