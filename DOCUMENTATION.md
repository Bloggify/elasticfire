## Documentation

You can see below the API reference of this module.

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

