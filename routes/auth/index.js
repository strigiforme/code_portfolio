/**

File: index.js
Author: Howard Pearce
Last Edit: May 2, 2021
Description: Handles authentication for portfolio

**/

// REFERENCES https://www.loginradius.com/blog/async/google-authentication-with-nodejs-and-passportjs/ ----------------------------------------

var express         = require("express");
var GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy;
var passport        = require("passport");
var session         = require("express-session");
var database        = require("database");
var logger          = require("logger");
var middleware      = require("middleware");
var accessCode_mgr = require("accessCode");
var authenticator   = require("authenticator");
var Sanitizer = middleware.sanitizer;

var app = module.exports = express();

// variable that we can put the users profile information in. Needed for authentication later.
var userProfile;

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// function to serialize the userProfile var we made
passport.serializeUser(function(user, cb) {
  cb(null, user);
});
// function to deserialize the userProfile var we made
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// google api setup for authentication
const GOOGLE_CLIENT_ID = '40436206251-ru4jeohin8cod771svsr5dmtp86as5kc.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'KknKW2b3k2KOjFAmm3F3dUXo';

// create login strategy to send to passport
var strategy = new GoogleStrategy({ clientID: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET, callbackURL: "http://howardpearce.ca/auth/google/callback" }, function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
)

// pass google api strategy to be used by passport
passport.use(strategy);

app.get('/auth', function (req, res, next) {
  if (authenticator.doAddAdmin) {
    res.redirect('/auth/newadmin');
  } else {
    res.redirect('/auth/google');
  }
});

app.get('/auth/newadmin', function (req, res, next) {
  var access_status = req.query.access;
  res.render('newadmin.pug', {loggedin: req.session.login, access: access_status});
  res.end();
});

app.post('/auth/newadmin', function (req, res, next) {
  // extract the code submitted by the user
  var code = Sanitizer.clean(req.body.code);
  try {
    var matches = accessCode_mgr.check_access(code);
    if (matches) {
      logger.info("Submitted code matches stored example. Next submitted email will become administrator account.");
      authenticator.isAccessCodeValid = true;
      res.redirect("/auth/google");
    } else {
      logger.info("Submitted code does not match stored example.");
      authenticator.isAccessCodeValid = false;
      res.redirect("/auth/newadmin?access=false");
    }
  } catch( err ) {
    logger.error("Error occurred while comparing access code: " + err);
    res.redirect("/");
  }
});

// send authentication request to google
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// receive the final response from google after logging in
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/?login=false' }), function(req, res) {
  req.session.email = userProfile.emails[0].value;
  // check if the submitted email should be made an administrator
  if ( authenticator.isAccessCodeValid ) {
    logger.info("Adding email " + req.session.email + " as the administrator account.");
    authenticator.admin = req.session.email;
    // turn off the newEmail flag to rerturn to base case
    authenticator.doAddAdmin = false;
    database.createAdmin(req.session.email).then( () => {
      logger.info("Admin account " + req.session.email + " successfully uploaded.");
      // turn off flag to ensure we don't add more administrators by accident.
      authenticator.isAccessCodeValid = false;
    }).catch(err => {
      logger.error(`Error occurred adding administrator email: ${err}`);
    });
  }

  // check if the email for the user's profile is authorized
  if(req.session.email == authenticator.admin) {
    req.session.login = true;
    logger.info("User email '" + req.session.email + "' successfully authenticated.");
    res.redirect("/admin");
  } else {
    req.session.login = false;
    logger.info("User email '" + req.session.email + "' was rejected.");
    logger.debug("Did not match administrator account '" + authenticator.admin + "'")
    res.redirect("/?login=false");
  }
});

// send people here to tell them they're naughty
app.get("/forbidden", function (req, res, next) {
  res.status(403).render("forbidden", {loggedin: req.session.login});
  res.end();
});
