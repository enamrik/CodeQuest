var router = require('express').Router(),
    blog = require('../domain/services/blog_service'),
    Post = require('../domain/models/Post'),
    _ = require('underscore');

router.get('/', function(req, res){
    blog.lastPost().then(function(post){
       res.redirect('/posts/' + post.shortTitle);
    });
});

router.get('/posts/:title', function(req, res){
    buildPageForPost(function(){
        return blog.getPostByShortTitle(req.params.title);
    }, res)
});

router.get('/find-posts', function(req, res){
     blog.getPostsByPhrase(req.query.search).then(function(data){
         res.json(data);
     });
});

function buildPageForPost(getPost, res){
    getPost().bind({})
        .then(function(post){
            this.lastPost = new Post(post);
        })
        .then(function(){
            return blog.postsCloseTo(this.lastPost.location());
        })
        .then(function(array){
            this.postsInRange = _.chain(array)
                .map(function(item){return new Post(item);})
                .sortBy(function(item){return -item.postedOn.getTime();})
                .value();
        })
        .then(function(){
            res.render('blog', {model: JSON.stringify({
                lastPost: this.lastPost,
                postsInRange: this.postsInRange
            })});
        });
}

module.exports = router;
