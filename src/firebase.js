import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import {GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, } 
    from "firebase/auth";
import { getFirestore, query, getDocs, 
    collection, where,  addDoc, } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDOrIUP3It_hreOsFcdD-0l0WabO0EGC7c",
    authDomain: "recme-390d0.firebaseapp.com",
    projectId: "recme-390d0",
    storageBucket: "recme-390d0.appspot.com",
    messagingSenderId: "140482636040",
    appId: "1:140482636040:web:c81cb6dd489ec5b9ce24bd",
    measurementId: "G-J8GPJ7224L"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const logout = () => {
    signOut(auth);
  };

  export {
    auth,
    db,
    analytics,
    storage,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
  };