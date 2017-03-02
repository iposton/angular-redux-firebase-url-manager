import firebase from 'firebase';

const config = {
    apiKey: API_KEY,
    authDomain: AUTH_DOM,
    databaseURL: DB_URL,
    storageBucket: STRG_BKT,
    messagingSenderId: MS_ID
};

firebase.initializeApp(config);
const database = firebase.database();


export default database;

  