/**

File: server.js
Author: Howard Pearce
Last Edit: March 18, 2021
Description: Main route and logic handler for node application. Everything that
             happens on the website starts here.

**/

// dependencies
var express            = require("express");
var fs                 = require("fs");
var access_code        = require("./lib/core/access_code.js");
var database           = require("./lib/core/database.js");
var authenticator      = require("./lib/core/authenticator.js");
var logger             = require("./lib/core/logger.js");
var auth               = require("./lib/auth");
var user               = require("./lib/user");
var admin              = require("./lib/admin");
var session            = require("express-session");
var passport           = require("passport");
var http               = require("http");
var https              = require("https");
var bodyParser         = require('body-parser');

var app = express();

// generate the users access code if it doesn't exist
access_code.generateAccessCode();

// initialize app
var options = {
  key: fs.readFileSync('C:/Certbot/live/howardpearce.ca/privkey.pem'),
  cert: fs.readFileSync('C:/Certbot/live/howardpearce.ca/fullchain.pem')
};

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
app.use(bodyParser.urlencoded({ extended: true }));

app.use(auth);
app.use(user);
app.use(admin);

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
