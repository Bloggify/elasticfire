"use strict";

// var DynamicPathMonitor = require("./DynamicPathMonitor");

const fbUtil = require("./fbutil")
    , EventEmitter = require("events")
    , objUnflatten = require("obj-unflatten")
    ;

module.exports = class PathMonitor extends EventEmitter {

    constructor (ins, path) {
        super();
        this.ins = ins;
        this.ref = fbUtil.fbRef(path.path);
        console.log("Indexing %s/%s using path '%s'", path.index, path.type, fbUtil.pathName(this.ref));
        this.esc = ins.esc;

        this.joins = (path.joins || []).map(c => {
            c.fbRef = fbUtil.fbRef(c.path);
            return c;
        });
        this.index = path.index;
        this.type = path.type;
        this.filter = path.filter || (() => true);
        this.parse = path.parser || (data => parseKeys(data, path.fields, path.omit));

        this.on("error", e => ins.emit("error", e));

        this._init();
    }

    _handleJoins (data, cb) {

        let joins = this.joins;

        if (!joins.length) {
            return cb(null, data);
        }

        let complete = 0
          , hadError = null
          , checkComplete = err => {
                hadError = err || null;
                if (--complete === 0) {
                    cb(hadError, data);
                }
            }
          ;

        joins.forEach(cJoinObj => {
            let cData = data[cJoinObj.name]; // ["id1", "id2"]
            if (Array.isArray(cData)) {
                cData.forEach((cId, i) => {
                    ++complete;
                    cJoinObj.fbRef.child(cId).once("value").then(obj => {
                        cData[i] = obj.val();
                        checkComplete();
                    }, err => {
                        this.emit("error", err);
                        checkComplete(err);
                    });
                });
            } else {
                ++complete;
                cJoinObj.fbRef.child(cData).once("value").then(obj => {
                    data[cJoinObj.name] = obj.val();
                    checkComplete();
                }, err => {
                    this.emit("error", err);
                    checkComplete(err);
                });
            }
        });
    }

    _init () {
        this.addMonitor = this.ref.on("child_added", this._process.bind(this, this._childAdded));
        this.changeMonitor = this.ref.on("child_changed", this._process.bind(this, this._childChanged));
        this.removeMonitor = this.ref.on("child_removed", this._process.bind(this, this._childRemoved));
    }

    _stop () {
        this.ref.off("child_added", this.addMonitor);
        this.ref.off("child_changed", this.changeMonitor);
        this.ref.off("child_removed", this.removeMonitor);
    }

    _process (fn, snap) {
        let dat = snap.val();
        if (this.filter(dat)) {
            this._handleJoins(dat, (err, dat) => {

                // The error is emitted already
                if (err) { return; }

                fn.call(this, snap.key, this.parse(dat));
            });
        }
    }

    _index (key, data, callback) {
        this.esc.index({
            index: this.index
          , type: this.type
          , id: key
          , body: data
        }, (error, response) => {
            callback && callback(error, response);
        });
    }

    _childAdded (key, data) {
        let name = nameFor(this, key);
        this._index(key, data, (error, res) => {
            if (error) {
                this.emit("error", new Error(`Failed to create index ${name}: ${error.message}`), error);
            } else {
                this.emit("index_created", name, res);
            }
        });
    }

    _childChanged(key, data) {
        let name = nameFor(this, key);
        this._index(key, data, (error, res) => {
            if (error) {
                this.emit("error", new Error(`Failed to update index ${name}: ${error.message}`), error);
            } else {
                this.emit("index_updated", name, res);
            }
        });
    }

    _childRemoved(key, data) {
        let name = nameFor(this, key);
        this.esc.delete({
            index: this.index
          , type: this.type
          , id: key
        }, (error, res) => {
            if (error) {
                this.emit("error", new Error(`Failed to delete index ${name}: ${error.message}`), error);
            } else {
                this.emit("indexe_deleted", name, res);
            }
        });
    }
}

function nameFor(path, key) {
    return path.index + "/" + path.type + "/" + key;
}

function parseKeys(data, fields, omit) {

    if (!data || typeof(data) !== 'object') {
        return data;
    }

    let out = data;

    // restrict to specified fields list
    if (Array.isArray(fields) && fields.length) {
        out = {};
        fields.forEach(function(f) {
            let newValue = findValue(data, f);
            if (newValue !== undefined) {
                out[f] = newValue;
            }
        });
    }

    // remove omitted fields
    if (Array.isArray(omit) && omit.length) {
        omit.forEach(function(f) {
            if (out.hasOwnProperty(f)) {
                delete out[f];
            }
        });
    }

    out = objUnflatten(out);
    return out;
}
