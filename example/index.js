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
          type : "city",
          joins: [
            {
                path: "foos",
                name: "foo"
            },
            {
                path: "foos",
                name: "foos"
            }
          ]
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
}).on("index_created", name => {
    console.log(`${name} created`);
}).on("index_updated", name => {
    console.log(`${name} updated`);
}).on("index_deleted", name => {
    console.log(`${name} deleted`);
});
