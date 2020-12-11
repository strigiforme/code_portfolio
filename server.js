// dependencies
var express = require("express");
var router = express.Router();
var passport = require("passport");
var session = require("express-session");

// THIS SECTION IS FOR INITIALIZING THE APP
var app = express();

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

// give access to public folder
app.use(express.static("public"));
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

app.set('view engine', 'pug');

// THIS SECTION HANDLES ROUTING FOR GET REQUESTS
// get request for root page
app.get('/', function (req, res) {
  res.render('index');
});

// get request to logout
app.get('/logout', function (req, res) {
  userProfile = null;
  res.redirect('/');
});

// get request for login page
app.get("/admin", function (req, res) {
  // check if the user profile has been populated
  if(userProfile){
    // check if the email for the user's profile is authorized
    if(userProfile.emails[0].value == "howardpearce0@gmail.com") {
      console.log("User email " + userProfile.emails[0].value + " successfully authenticated.");
      res.render('admin.pug');
    } else {
      console.log("User email " + userProfile.emails[0].value + " was rejected.");
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
});






// THE FOLLOWING IS FOR GOOGLE AUTHENTICATION: DO NOT TOUCH OR SO HELP ME
// REFERENCES https://www.loginradius.com/blog/async/google-authentication-with-nodejs-and-passportjs/

/*  PASSPORT SETUP  */

var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '40436206251-ru4jeohin8cod771svsr5dmtp86as5kc.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'KknKW2b3k2KOjFAmm3F3dUXo';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/admin');
  });
