define(['ko', 'underscore', 'ViewModel', 'models/Post'], function (ko, _, ViewModel, Post) {
    var Blog = function () {
        var self = this;
        ViewModel.call(self);

        var originalNearbyPosts;

        self.posts = null;
        self.nearbyPosts = ko.observable();
        self.searchText = ko.observable();

        self.initialize = function (data) {
            originalNearbyPosts = data.NearbyPosts;
            buildPosts(data.NearbyPosts);
            self.currentPost = new Post(data.CurrentPost);
            self.PageTitle(self.currentPost.Title());
            setupComments();
        };

        self.isCurrentPost = function (post) {
            return post.Handle() == self.currentPost.Handle();
        };

        self.nearbyPostUrl = function (post) {
            return self.isCurrentPost(post) ? '#' : '/posts/' + post.Handle();
        };

        self.throttledSearchText = ko.computed(self.searchText).extend({ throttle: 400 });

        self.throttledSearchText.subscribe(function (val) {
            var searchTerm = val.trim();

            if (searchTerm.length == 0) {
                buildPosts(originalNearbyPosts);
                return;
            }

            self.get('/find', { search: searchTerm }, function (data) {
                buildPosts(data);
            });
        });

        function setupComments() {
            window.setTimeout(function() {
                var dsq = window.document.createElement('script');
                dsq.type = 'text/javascript';
                dsq.async = true;
                dsq.src = '//code-quest.disqus.com/embed.js';
                (window.document.getElementsByTagName('head')[0] || window.document.getElementsByTagName('body')[0]).appendChild(dsq);
            });
        }

        function buildPosts(postsArray) {
            self.nearbyPosts(_.map(postsArray, function (post) { return new Post(post); }));
        }
    };
    return Blog;
});