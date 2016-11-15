"use strict";

const ElasticFire = require("..");

// Initialize the ElasticFire instance
let ef = new ElasticFire({

    // Set the Firebase configuration
    firebase: {
        apiKey: "AI...BY",
        authDomain: "em...d.firebaseapp.com",
        databaseURL: "https://em...d.firebaseio.com",
        storageBucket: "em...d.appspot.com",
        messagingSenderId: "95...36"
    }

    // Firebase paths and how to index them in Elasticsearch
  , paths: [
       {
           // Firebase path
           path : "articles"

           // Elasticsearch index and type
         , index: "articles"
         , type : "article"

           // Optional joined fields
         , joins: [
               // The `author` is a field from the article
               // which points to the `users` collection.
               {
                   path: "users"
                 , name: "author"
               }

               // If we have an array of comment ids, pointing
               // to another collection, then they will be joined too
             , {
                   path: "comments"
                 , name: "comments"
               }
           ]

           // Filter out some data
         , filter: (data, snap) => snap.key !== "_id"
       }
    ]
});

// Listen for the events emitted by
// the ElasticFire instanceand output some data
ef.on("error", err => {
    console.error(err);
}).on("index_created", name => {
    console.log(`${name} created`);
}).on("index_updated", name => {
    console.log(`${name} updated`);
}).on("index_deleted", name => {
    console.log(`${name} deleted`);
});
