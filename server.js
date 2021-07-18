/**

File: server.js
Author: Howard Pearce
Last Edit: June 8, 2021
Description: Main route and logic handler for node application. Everything that
             happens on the website starts here.

**/

// dependencies
const express            = require("express");
const fs                 = require("fs");
const access_code_mgr    = require("access_code");
const authenticator      = require("authenticator");
const database           = require("database");
const logger             = require("logger");
const auth               = require("./routes/auth");
const user               = require("./routes/user");
const admin              = require("./routes/admin");
const session            = require("express-session");
const passport           = require("passport");
const http               = require("http");
const https              = require("https");
const bodyParser         = require('body-parser');

// gotta do this idk why
var app = express();

// start the database
database.connect('mongodb://127.0.0.1/my_database').then( () => {
  // fetch the administrator's email address after connecting
  authenticator.fetchAdminAccount();
});

// initialize logger
logger.initialize( { level:"DEBUG" } );

// generate the users access code if it doesn't exist
access_code_mgr.create_access_code({});

// initialize app
// var options = {
//   key: fs.readFileSync('C:/Certbot/live/howardpearce.ca/privkey.pem'),
//   cert: fs.readFileSync('C:/Certbot/live/howardpearce.ca/fullchain.pem')
// };

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
app.use(bodyParser.urlencoded({ extended: true, limit: '100kb', parameterLimit: 1000 }));

// Routing logic
app.use(auth);
app.use(user);
app.use(admin);

// for receiving post requests
app.use(express.urlencoded({
  extended: true
}))

// Create an HTTP service.
//http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
//https.createServer(options, app).listen(443);
app.listen( 3000, ()  => {} );

// set view engine to be pug
app.set('view engine', 'pug');
