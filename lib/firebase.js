"use strict";

const Firebase = require("firebase");

module.exports = {
    init (config) {
        Firebase.initializeApp(config)
    }

  , fbRef (path) {
        return Firebase.database().ref().child(path);
    }

  , pathName (ref) {
        var p = ref.parent.key;
        return (p ? p + "/" : "") + ref.key;
    }
};
