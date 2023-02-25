// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { getDatabase, ref } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Web app Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwrwwTRiyYV7-SzOvE6kEteE0lmYhBe8c",
  authDomain: "qapplaapp.firebaseapp.com",
  databaseURL: "wss://qapplaapp.firebaseio.com",
  projectId: "qapplaapp",
  storageBucket: "qapplaapp.appspot.com",
  messagingSenderId: "779347879760",
  appId: "1:779347879760:web:184b3599a42b2f7820ee55",
  measurementId: "G-WNYMX6JJJ0"
};

const app = initializeApp(firebaseConfig);

export const functions = getFunctions(app);
export const database = ref(getDatabase(app));
export const auth = getAuth(app);
export const storage = getStorage(app);