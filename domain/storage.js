var _ = require('underscore'),
    Promise = require('bluebird'),
    MongoClient = require('mongodb').MongoClient;

var Storage = function(){
    this.db = null;
    this.collections = null;
};

Storage.prototype._connect = function(connString){
    return new Promise(function(resolve, reject){
        return MongoClient.connect(connString, function(err, db){
            if(err){
                return reject(err);
            }
            return resolve(db);
        })
    });
};

Storage.prototype.connect = function(collections){
    var self = this;
    self.collections = collections;

    return this._connect("mongodb://localhost:27017/codequest")
        .then(function(db){
            self.db = db;

            self.collections.forEach(function(name){
                Storage.prototype[name] = new Collection(name, self);
            });
        });
};

Storage.prototype.empty = function() {
    this._assertInit();
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

Storage.prototype._assertInit = function(){
   if(!this.db) {
      throw new Error("Storage not initialized");
   }
};

function Collection(name, storage){
    this.name = name;
    this.storage = storage;
}

Collection.prototype.__col = function(){
    return this.storage.db.collection(this.name);
}

Collection.prototype.ensureIndex = function(index, options){
    this.storage._assertInit();
    var self = this;
    return new Promise(function(resolve, reject){
        self.__col().ensureIndex(index, options, function(err, i){
            if(err) {
                reject(err);
            }else{
                resolve() ;
            }
        })
    });
};

Collection.prototype.find = function(query, options){
    this.storage._assertInit();
    var cursor = this.__col().find(query, options || {});
    return new Cursor(cursor);
};

Collection.prototype.findOne = function(query, options){
    this.storage._assertInit();
    var self = this;

    return new Promise(function(resolve, reject){
        self.__col().findOne(query, null, options, function(err, item){
            if(err) {
                reject(err);
            }else{
                resolve(item);
            }
        });
    });
}

Collection.prototype.insert = function(model){
    this.storage._assertInit();
    var self = this;

    return new Promise(function(resolve, reject){
        self.__col().insert(model, function(err, docs){
            if(err) {
                reject(err);
            }else{
                resolve(docs);
            }
        });
    });
};

function Cursor(cursor){
    this.cursor = cursor;
}

Cursor.prototype.toArray = function(){
    var self = this;
   return new Promise(function(resolve, reject){
       self.cursor.toArray(function(err, docs){
           if(err) {
               reject(err);
           }else{
               resolve(docs);
           }
       });
   });
}

module.exports = new Storage();

