define(['ko', 'moment', 'Model'], function (ko, moment, Model) {
    var Post = function (data) {
        var self = this;
        Model.call(self, data, {
            'PostedOn': null,
            'Title': '',
            'Content': '',
            'Handle': ''
        });

        self.displayPostedOn = function() {
            return moment(self.PostedOn()).format('LL');
        };
    };
    return Post;
});