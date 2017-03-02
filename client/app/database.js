import firebase from 'firebase';

// const doSomething = function(key) {
//   console.log(key);
// }

//doSomething(process.env);
this._http.get(process.env.API_URL, options);
//doSomething(process.env)
console.log(process.env.API_URL + ' ' + options);
const config = {
    apiKey: process.env.API_KEY,
    authDomain: AUTH_DOM,
    databaseURL: DB_URL,
    storageBucket: STRG_BKT,
    messagingSenderId: MS_ID
};

firebase.initializeApp(config);
const database = firebase.database();


export default database;

  