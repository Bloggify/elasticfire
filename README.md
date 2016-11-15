
[![elasticfire](https://i.imgur.com/WnGtDhC.png)](#)

# elasticfire

 [![Version](https://img.shields.io/npm/v/elasticfire.svg)](https://www.npmjs.com/package/elasticfire) [![Downloads](https://img.shields.io/npm/dt/elasticfire.svg)](https://www.npmjs.com/package/elasticfire)

> A flexibe and configurable module to connect Firebase with Elasticsearch.

## :rocket: Features

 - Easily configure the way how the data should be taken from Firebase
 - Filter out documents
 - Include and exclude specific fields
 - Support for joins


## :cloud: Installation

```sh
$ npm i --save elasticfire
```


## :clipboard: Example



```js
const ElasticFire = require("elasticfire");

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
```

## :memo: Documentation


### `ElasticFire(config)`
Creates a new instance of `ElasticFire`.

#### Params
- **Object** `config`: An object containing the following fields:
   - paths (Array): An array of objects to configure the way how the
     data is taken from Firebase:
       - `index` (String): The Elasticsearch index name.
       - `type` (String): The Elasticsearch type name.
       - `joins` (Array): An array of objects configuring the joins:
           - `name` (String): The field which is an id pointing to
             another collection in Firebase.
           - `path` (String): The Firebase collection path where
             the the ids are pointing to.
       - `fields` (Array): An array of dot-notation strings
         representing the fields to include in the objects.
       - `omit` (Array): An array of dot-notation strings
         representing the fields to omit.
       - `filter` (Function): A function to filter the objects (if it
         returns `false`, the object is not indexed). The function
         receives as arguments the `data` object and the `snapshot`.

         By default, all the objects from a path are indexed.
   - `firebase` (Object): The Firebase configuration.
   - elasticSearch (Object): The Elasticsearch configuration:
       - host (String): The Elasticsearch host (default: `localhost`).
       - port (Number): The Elasticsearch port (default: `9200`).
       - auth (Object): The credentials.
          - user (String): The user to be used.
          - pass (String): The password to be used.

#### Return
- **ElasticFire** The `ElasticFire` instance.

### `search()`
Triggers the search in Elasticsearch.



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## :cake: Thanks
[`flashlight`](https://github.com/firebase/flashlight) was the main inspiration for this project. :cake:


## :scroll: License

[MIT][license] © [Bloggify][website]

[license]: http://showalicense.com/?fullname=Bloggify%20%3Csupport%40bloggify.org%3E%20(https%3A%2F%2Fbloggify.org)&year=2013#license-mit
[website]: https://bloggify.org
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
