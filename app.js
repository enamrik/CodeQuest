var express = require('express'),
    app = express(),
    storage = require('./domain/storage')
    path = require('path'),
    favicon = require('serve-favicon');

function initialize(){
    app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use('/static', express.static(path.join(__dirname, 'public')));

    app.use('/', require('./routes/blog'));

    app.listen(3000, function(){
        console.log("Listening on port 3000...");
    });
}

function seedDatabase(){
    return require('./domain/services/seed_service')();
}

function emptyDatabase(){
    return storage.empty();
}

function setupDatabase(){
    return storage.posts.ensureIndex({'coordinates': '2d'}, {min: 0, max: 1});
}

storage.connect(['posts'])
    .then(emptyDatabase)
    .then(setupDatabase)
    .then(seedDatabase)
    .then(initialize);



