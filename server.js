console.log("loading server.js");

var express = require('express'),
    server = express(),
    bodyParser = require('body-parser'),
    // MongoClient = require('mongodb').MongoClient,
    // ObjectID = require('mongodb').ObjectID,
    // MONGOURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/rummy',
    ejs = require('ejs'),
    expressLayouts  = require('express-ejs-layouts'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    PORT = process.env.PORT || 8080;

    // mongoose.connect(MONGOURI);

//TODO: code below for when I have MongoDB up and running
// var db = mongoose.connection;
//
// db.on('error', function() {
//   console.log('Database error');
// });
//
// db.once('open', function(){
// server.listen(PORT);
// server.db = db;
// console.log('Ready For Action');
// });

server.listen(PORT, function() {
  console.log('server is UP AND RUNNING on port', PORT);
});

/*<><><><><><><>MIDDLEWARE<><><><><><><><>*/
//setting up views
server.set('views', './'); //TODO: move views to './views' and change this line
server.set('view engine', 'ejs');
server.use(express.static('./')); //TODO: delete if unused.

server.use(bodyParser.urlencoded({extended:true})); //for use in parsing user-submitted forms
server.use(bodyParser.json()); //for use with angular and $http
server.use(morgan('short')); //activating morgan logging

server.get('/rummy', function (req, res) {
  res.render('index');
});
