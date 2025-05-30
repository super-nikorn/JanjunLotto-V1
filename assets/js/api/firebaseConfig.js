import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyACvz8DwQOW_7WLzU5uvD6fpU0BI5MoZ_8",
  authDomain: "mylogin-e355f.firebaseapp.com",
  projectId: "mylogin-e355f",
  storageBucket: "mylogin-e355f.appspot.com",
  messagingSenderId: "950589957571",
  appId: "1:950589957571:web:xxxxxxx"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
