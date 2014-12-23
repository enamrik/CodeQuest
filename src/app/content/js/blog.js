require(['knockout', 'underscore', './root', './models/Post', 'jquery'],
    function(ko, _, RootView, Post, $){

    var Blog = function () {
        this.postsInRange = ko.observable();
        this.searchText = ko.observable();
        this.throttledSearchText = ko.computed(this.searchText).extend({ throttle: 400 });
    };

    Blog.prototype.configure = function (data) {
        var self = this;
        this.buildPosts(data.postsInRange);
        this.currentPost = new Post(data.lastPost);
        this.pageTitle = this.currentPost.title;

        this.throttledSearchText.subscribe(function (val) {
            var searchTerm = val.trim();

            self.get('/find-posts', { search: searchTerm }, function (data) {
                self.buildPosts(data);
            });
        });

        if(this.currentPost.enableComments){
            this._setupComments();
        }
    };

    Blog.prototype._setupComments = function() {
        window.setTimeout(function() {
            var dsq = window.document.createElement('script');
            dsq.type = 'text/javascript';
            dsq.async = true;
            dsq.src = '//code-quest.disqus.com/embed.js';
            (window.document.getElementsByTagName('head')[0] || window.document.getElementsByTagName('body')[0]).appendChild(dsq);
        });
    }

    Blog.prototype.isCurrentPost = function (post) {
        return post.shortTitle == this.currentPost.shortTitle;
    };

    Blog.prototype.postsInRangeUrl = function (post) {
        return this.isCurrentPost(post) ? '#' : '/posts/' + post.shortTitle;
    };

    Blog.prototype.buildPosts = function(postsArray) {
        this.postsInRange(_.map(postsArray, function (post) { return new Post(post); }));
    }

    RootView.start(Blog);
});
