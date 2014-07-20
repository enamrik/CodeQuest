define(['ko', 'moment', 'Model'], function (ko, moment, Model) {
    var Refresher = function (data) {
        var self = this;
        Model.call(self, data, {
            'Title': '',
            'Content': ''
        });
    };
    return Refresher;
});

