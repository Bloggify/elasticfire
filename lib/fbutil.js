"use strict";

const Firebase = require("firebase");

exports.init = function(config) {
    Firebase.initializeApp(config)
};

exports.fbRef = function(path) {
    return Firebase.database().ref().child(path);
};

exports.pathName = function(ref) {
    var p = ref.parent.key;
    return (p ? p + "/" : "") + ref.key;
};
