// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBh1KXPDM6H_61XwQFe3qwyotFI9ZFOPOc",
//   authDomain: "tpreactnative-a4ae2.firebaseapp.com",
//   projectId: "tpreactnative-a4ae2",
//   storageBucket: "tpreactnative-a4ae2.appspot.com",
//   messagingSenderId: "494356911108",
//   appId: "1:494356911108:web:f64951af7ec90aaf055151",
//   measurementId: "G-QVFRG671DB"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyDWaRzL2ATFLPbvNg5kLioyvVjTv3o2jMo",
//   authDomain: "mobile-a9df3.firebaseapp.com",
//   projectId: "mobile-a9df3",
//   storageBucket: "mobile-a9df3.appspot.com",
//   messagingSenderId: "41866985121",
//   appId: "1:41866985121:web:c42b575651c6cd09b4bae0",
//   measurementId: "G-0C5XMJ3VSJ",
// };

const firebaseConfig = {
  apiKey: "AIzaSyBIAWJ-A3_BDU5P3xm-D-pOw1BsFrU1Fd4",
  authDomain: "med-aziz-chebbi.firebaseapp.com",
  projectId: "med-aziz-chebbi",
  storageBucket: "med-aziz-chebbi.appspot.com",
  messagingSenderId: "143982738011",
  appId: "1:143982738011:web:19717079523abadd7cdd7e",
  measurementId: "G-7WLRW4EQCG",
};

// Initialize Firebase

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
