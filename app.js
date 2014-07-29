var express = require('express'),
    app = express(),
    storage = require('./domain/storage')
    path = require('path'),
    favicon = require('serve-favicon'),
    program = require('commander');

program
    .version('0.0.1')
    .option('-p, --port <n>', 'Port to listen on', parseInt)
    .parse(process.argv);

var port = program.port || 3000;

function initialize(){
    app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use('/static', express.static(path.join(__dirname, 'public')));

    app.use('/', require('./routes/blog'));

    app.listen(port, function(){
        console.log("Listening on port %j...", port);
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



