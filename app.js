var path = require('path');
var express = require('express');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

console.log(path.join(__dirname, 'public'));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/blog'));

app.listen(3000, function(){
    console.log("Listening on port 3000...");
});