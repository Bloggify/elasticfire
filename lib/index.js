"use strict";

const EventEmitter = require("events")
    , firebase = require("firebase")
    , ul = require("ul")
    , PathMonitor = require("./path-monitor")
    , fbUtil = require("./fbutil")
    , elasticsearch = require("elasticsearch")
    ;

const ENV = process.env;

module.exports = class ElasticFire extends EventEmitter {

    /**
     * ElasticFire
     * Creates a new instance of `ElasticFire`.
     *
     * @name ElasticFire
     * @function
     * @param {Object} config An object containing the following fields:
     *
     *    - paths (Array): An array of objects to configure the way how the
     *      data is taken from Firebase:
     *        - `index` (String): The Elasticsearch index name.
     *        - `type` (String): The Elasticsearch type name.
     *        - `joins` (Array): An array of objects configuring the joins:
     *            - `name` (String): The field which is an id pointing to
     *              another collection in Firebase.
     *            - `path` (String): The Firebase collection path where
     *              the the ids are pointing to.
     *        - `fields` (Array): An array of dot-notation strings
     *          representing the fields to include in the objects.
     *        - `omit` (Array): An array of dot-notation strings
     *          representing the fields to omit.
     *        - `filter` (Function): A function to filter the objects (if it
     *          returns `false`, the object is not indexed). The function
     *          receives as arguments the `data` object and the `snapshot`.
     *
     *          By default, all the objects from a path are indexed.
     *    - elasticSearch (Object): The Elasticsearch configuration:
     *        - host (String): The Elasticsearch host (default: `localhost`).
     *        - port (Number): The Elasticsearch port (default: `9200`).
     *        - auth (Object): The credentials.
     *           - user (String): The user to be used.
     *           - pass (String): The password to be used.
     *
     * @returns {ElasticFire} The `ElasticFire` instance.
     */
    constructor (config) {

        super();

        config = ul.merge(config, {
            elasticSearch: {
                auth: {}
            }
          , paths: []
        });

        if (!config.elasticSearch.hosts) {
            config.elasticSearch = {
                hosts: [{
                    host: config.elasticSearch.host || "localhost"
                  , port: config.elasticSearch.port || 9200
                  , auth: (config.elasticSearch.auth.user && config.elasticSearch.auth.pass) ?  config.elasticSearch.auth.user + ":" + config.elasticSearch.auth.pass : null
                }]
            };
        }

        config = ul.deepMerge(config, {
            elasticSearch: {
                hosts: [{
                    host: ENV.ES_HOST
                  , port: ENV.ES_PORT
                  , auth: (ENV.ES_USER && ENV.ES_PASS) ? ENV.ES_USER + ":" + ENV.ES_PASS : null
                }]
            }
        });

        this.config = config;

        if (config.firebase) {
            fbUtil.init(config.firebase);
        }


        this.firebaseDb = firebase.database();
        this.firebaseDbRef = this.firebaseDb.ref();
        this.esc = this.elasticSearchClient = new elasticsearch.Client(config.elasticSearch);

        this.pathMonitors = config.paths.map(c => new PathMonitor(this, c));

        this.esc.ping({}, err => {
            if (err) {
                this.emit("error", err);
            } else {
                this.emit("ES_CONNECTED");
            }
        });
    }

    /**
     * search
     * Triggers the search in Elasticsearch.
     *
     * @name search
     * @function
     */
    search () {
        this.esc.search.apply(this.esc, arguments);
    }
};
