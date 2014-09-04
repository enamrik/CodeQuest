var _ = require('underscore'),
    Promise = require('bluebird'),
    mongo = require('mongodb');

Promise.promisifyAll(mongo.MongoClient);
Promise.promisifyAll(mongo.Collection.prototype);
Promise.promisifyAll(mongo.Cursor.prototype);


var Storage = function(){
    this.db = null;
    this.collections = null;
};

Storage.prototype.connect = function(collections){
    var self = this;
    self.collections = collections;

    return mongo.MongoClient.connectAsync("mongodb://localhost:27017/codequest")
        .then(function(db){
            self.db = db;
            self.collections.forEach(function(name){
                self.__defineCollectionProperty(name);
            });
        });
};

Storage.prototype.__defineCollectionProperty = function (name) {
    var self = this;

    Object.defineProperty(Storage.prototype, name, {
        get: function () {
            self.__assertInit();
            return self.db.collection(name);
        }
    })
};

Storage.prototype.empty = function () {
    this.__assertInit();
    var self = this;

    return Promise.map(self.collections, function(name){
        return self.db.dropCollection(name);
    });
};

Storage.prototype.close = function(){
    if(this.db){
        return this.db.close();
    }
    return Promise.resolve();
};

Storage.prototype.__assertInit = function () {
    if (!this.db) {
        throw new Error("Storage not initialized");
    }
};

module.exports = new Storage();

