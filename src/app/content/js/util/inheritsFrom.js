var mapper = require('./mapper');

module.exports = function(base, parent){
    var proto = new parent();
    mapper.mapJs(base.prototype, proto);
    base.prototype = proto;
    base.prototype.constructor = base;
};
