"use strict";

const EventEmitter = require("events")
    , firebase = require('firebase')
    , ul = require("ul")
    , PathMonitor = require("./path-monitor")
    , fbUtil = require("./fbutil")
    , elasticsearch = require("elasticsearch")
    ;

const ENV = process.env;

module.exports = class ElasticFire extends EventEmitter {
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
              , auth: (ENV.ES_USER && ENV.ES_PASS) ? ENV.ES_USER + ':' + ENV.ES_PASS : null
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

    search () {
        this.esc.search.apply(this.esc, arguments);
    }
};
