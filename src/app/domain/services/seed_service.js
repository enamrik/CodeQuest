var db = require('./../storage'),
    markdown = require('markdown').markdown,
    Promise = require('bluebird'),
    glob = Promise.promisify(require('glob')),
    readFile = Promise.promisify(require("fs").readFile),
    path = require('path'),
    Post = require('../models/Post');

function seedDatabase(){
    return glob(__dirname + '/../../seed/posts/*.md')
        .then(mapFilesToPosts);
}

function mapFilesToPosts(files) {
    return Promise.map(files, function (file) {
        return readFile(file, 'utf-8')
            .then(markdown.toHTML)
            .then(function (html) {
                return insertNewPost(file, html)
            });
    });
}

function insertNewPost(file, html) {
    var post = newPost(file, html);
    console.log("[DEBUG] inserted post ", post.title);
    return db.posts.insertAsync(post);
}

function newPost(seedFile, markdown){
    var parts = path.basename(seedFile).match(/^([0-9]{8})-(.+)$/);
    var title = parts[2].match(/^(.*).md$/)[1];

    return new Post({
        title: title,
        postedOn: parseDate(parts[1]),
        content: markdown,
        enableComments: !/.*Design\ Patterns\ -.*/.test(title)
    });
}

function parseDate(dateString){
   var matches = dateString.match(/^([0-9]{2})([0-9]{2})([0-9]{4})$/) ;
   return new Date(Date.UTC(parseInt(matches[3]), parseInt(matches[1]) - 1, parseInt(matches[2])));
}

module.exports = seedDatabase;




