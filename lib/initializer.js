var express = require("express");
var passport = require("passport");
var session = require("express-session");

// connect to the local database instance
exports.initApp = function() {

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

  // listen callback
  app.listen(3000, function(){
    console.log("Listening on port 3000!")
  });

  // set view engine to be pug
  app.set('view engine', 'pug');

  return app;

}
