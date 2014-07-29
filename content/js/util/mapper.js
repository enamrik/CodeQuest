var mapping = require('knockout.mapping');

module.exports = {
    mapKo: mapping.fromJS,
    mapJs: function(mapFromObj, obj) {
        for(var property in mapFromObj) {
            if(mapFromObj.hasOwnProperty(property)){
                obj[property] = mapFromObj[property];
            }
       }
    }
};