define(['knockout', '../util/mapper', 'moment'], function (ko, mapper, moment) {
    var Post = function (data) {
        mapper.mapJs(data, this);
    };

    Post.prototype.displayPostedOn = function() {
        return moment.utc(this.postedOn).format('LL');
    };

    return Post;
});