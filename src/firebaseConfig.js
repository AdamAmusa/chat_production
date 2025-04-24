import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import { getAuth} from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import { } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB-UZBt0wfBSjX9LIKcmWvJ5EOzh4JtWR0",
    authDomain: "chat-e48d2.firebaseapp.com",
    projectId: "chat-e48d2",
    storageBucket: "chat-e48d2.appspot.com",
    messagingSenderId: "485655526487",
    appId: "1:485655526487:web:95eb688ead5ed43e0b7712",
    measurementId: "G-4CGDENJTGF"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig); 
export const auth = getAuth(app);                  
export const db = getFirestore(app);



