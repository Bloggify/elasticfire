"use strict";

const ElasticFire = require("..");

let ef = new ElasticFire({
    firebase: {
        apiKey: "AIzaSyAsFK9oDTtsCdqrHAfQKs8_TmNtBOoIkBY",
        authDomain: "emma-ea74d.firebaseapp.com",
        databaseURL: "https://emma-ea74d.firebaseio.com",
        storageBucket: "emma-ea74d.appspot.com",
        messagingSenderId: "95300595436"
    }
  , paths: [
       {
          path : "cities",
          index: "firebase",
          type : "city"
       },
       {
          path  : "messages",
          index : "firebase",
          type  : "message",
          fields: ['msg', 'name'],
          filter: function(data) { return data.name !== 'system'; }
       }
    ]
});

ef.on("error", err => {
    console.error(err);
});
