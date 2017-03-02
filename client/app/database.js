import firebase from 'firebase';

const config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOM,
    databaseURL: process.env.DB_URL,
    storageBucket: process.env.STRG_BKT,
    messagingSenderId: process.env.MS_ID
};

firebase.initializeApp(config);
const database = firebase.database();


export default database;

  