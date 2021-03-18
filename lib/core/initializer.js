/**

File: initializer.js
Author: Howard Pearce
Last Edit: Febuary 13, 2021
Description: Provides functions that initialize the application, doing simple
             configurations to set up that application as we expect.

**/

var express     = require("express");
var passport    = require("passport");
var session     = require("express-session");
var bodyParser  = require('body-parser');
var https       = require('https');
var http        = require('http');
const fs        = require("fs");
var multer      = require('multer');
var snippets    = multer({dest: 'snippets/' });
const path      = require('path');

// connect to the local database instance
exports.initApp = function() {

  // This line is from the Node.js HTTPS documentation.
  var options = {
    key: fs.readFileSync('C:/Certbot/live/howardpearce.ca/privkey.pem'),
    cert: fs.readFileSync('C:/Certbot/live/howardpearce.ca/fullchain.pem')
  };

  var app = express();

  // set up sessions
  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
  }));

  // give access to public folder
  app.use(express.static("public"));

  // initialize sessions
  app.use(passport.initialize());
  app.use(passport.session());

  // for receiving post requests
  app.use(express.urlencoded({
    extended: true
  }))

  // Create an HTTP service.
  http.createServer(app).listen(80);
  // Create an HTTPS service identical to the HTTP service.
  https.createServer(options, app).listen(443);

  // set view engine to be pug
  app.set('view engine', 'pug');

  return app;

}
