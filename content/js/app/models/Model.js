define(['ko'], function(ko) {
    var Model = function(data, properties, mapping) {
        ko.mapping.fromJS(ko.utils.objectWithProperties(properties, data), mapping || {}, this);
    };
    return Model;
});