const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDsxRpHPku20wbSqmXQLRhrLz2-_bPmbnU",
  authDomain: "as-it-stands.firebaseapp.com",
  projectId: "as-it-stands",
  storageBucket: "as-it-stands.appspot.com",
  messagingSenderId: "534214552879",
  appId: "1:534214552879:web:a44890760447fde78ec5da",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = {
  auth,
  db,
};
