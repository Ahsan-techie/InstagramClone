import firebase from 'firebase'
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDVTQ-MaeXQwb9xrFXUTR2rTCeZB1osOeU",
    authDomain: "instagram-clone-5b47b.firebaseapp.com",
    projectId: "instagram-clone-5b47b",
    storageBucket: "instagram-clone-5b47b.appspot.com",
    messagingSenderId: "199725953692",
    appId: "1:199725953692:web:b74aefea1898701b447359",
    measurementId: "G-6PJKLPPS8P"
})

const db= firebaseApp.firestore();
const auth= firebaseApp.auth();
const storage= firebaseApp.storage();

export {db,auth,storage}