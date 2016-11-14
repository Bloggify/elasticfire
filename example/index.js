"use strict";

const ElasticFire = require("..");

let ef = new ElasticFire({
    firebase: {
        databaseURL: "..."
      , serviceAccount: "..."
    }
  , paths: [
       {
          path : "users",
          index: "firebase",
          type : "user"
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
