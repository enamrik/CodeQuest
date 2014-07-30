var express = require('express'),
    app = express(),
    storage = require('./domain/storage')
    path = require('path'),
    favicon = require('serve-favicon'),
    program = require('commander'),
    cluster = require("cluster");

program
    .version('0.0.1')
    .option('-p, --port <n>', 'Port to listen on', parseInt)
    .option('-r, --prod', 'Run app in production mode')
    .parse(process.argv);

console.log("Running in mode: ", program.prod ? "PROD" : "DEV");

var port = program.port || 3000;

if(!program.prod){
    connectToMongo()
        .then(emptyDatabase)
        .then(setupDatabase)
        .then(seedDatabase)
        .then(initialize);
    return;
}

if(cluster.isMaster){
    connectToMongo()
        .then(emptyDatabase)
        .then(setupDatabase)
        .then(seedDatabase)
        .then(setupCluster)
}else{
    connectToMongo()
        .then(initialize);
}

function initialize(){
    app.use(favicon(path.join(__dirname, 'public/images/favicon.png')));
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use('/static', express.static(path.join(__dirname, 'public')));
    app.use('/', require('./routes/blog'));

    console.log("Connecting pid=%j on port %j...", process.pid, port);

    app.listen(port, function(){
        console.log("Listening pid=%j on port %j...", process.pid, port);
    });
}

function setupCluster(){
    console.log("Control process running: PID=" + process.pid);

    require("os").cpus().forEach(function(){
        cluster.fork();
    });

    cluster.on("exit", function(worker, code) {
        if (code != 0) {
            console.log("Worker crashed! Spawning a replacement.");
            cluster.fork();
        }
    });
}

function connectToMongo(){
    return storage.connect(['posts']);
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


