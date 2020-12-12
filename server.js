// dependencies
var express = require("express");
var router = express.Router();
var passport = require("passport");
var session = require("express-session");
var mongoose = require("mongoose")


// CONNECT THE DATABASE
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
mongoose.connect('mongodb://127.0.0.1/my_database', {useNewUrlParser: true, useUnifiedTopology: true});
var mongodb = mongoose.connection;
mongodb.on('error', console.error.bind(console, 'MongoDB connection error:'));
// set up the schema and objects for the database
const postSchema = mongoose.Schema ({
  title: String,
  content: String
});
const Post = mongoose.model('Post', postSchema);

// THIS SECTION IS FOR INITIALIZING THE APP
var app = express();
// set up sessions
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
app.get('/', function (req, res, next) {
  var login_status = req.query.login;
  res.render('index', {login: login_status});
  res.end()
});

// THIS SECTION IS FOR HANDLING THE GENERATION AND VIEWING OF POSTS
app.get("/posts/add", function (req, res, next) {
  res.render("posts/addpost");
  res.end()
});

// receive request to create a new post
app.post("/posts/upload-post", authenticateUser, function (req, res, next) {

  var newTitle = req.body.title;
  var newText = req.body.content;

  var newPost = new Post({ title: newTitle, content: newText });

  newPost.save(function (err, post) {
      if (err) return console.error(err);
      console.log(post.name + " saved to bookstore collection.");
    });

  res.redirect("/admin");
  res.end();
});

// receive post request to delete a post
app.post("/posts/delete_post", authenticateUser, function (req, res, next) {

  var id = req.body.id;

  Post.deleteOne({_id: id}, function(err, obj) {
    if (err) throw err;
    console.log("Deleted post with id: " + id)
  });

  res.redirect("/admin?delete=true");
  res.end();
});

// receive post request to edit a post
app.post("/posts/edit_post", authenticateUser, function (req, res, next) {

  var id = req.body.id;

  Post.deleteOne({_id: id}, function(err, obj) {
    if (err) throw err;
    console.log("Deleted post with id: " + id)
  });

  res.redirect("/admin?delete=true");
  res.end();
});

// view all posts that have been created
app.get("/posts/view_posts", function (req,res,next) {
  Post.find({}, function(err, posts) {
    res.render("posts/viewposts", { postdata: posts });
    res.end();
  })
});

// view individual post
app.get("/posts/view_post", function (req,res,next) {
  // TODO: validate get string to prevent injection
  Post.find({ _id: req.query.id }, function(err, post) {
    res.render("posts/viewpost", { postdata: post });
    res.end();
  })
});

// THIS SECTION ALL RELATES TO HANDLING REQUESTS FOR LOGGING IN / CONFIRMING IDENTITY
// get request to logout
app.get('/logout', function (req, res, next) {
  userProfile = null;
  res.redirect('/');
});

// get request for login page
app.get("/admin", authenticateUser, function (req, res, next){
  Post.find({}, function(err, posts) {
    res.render('admin.pug', { postdata: posts });
    res.end();
  })
});

// send people here to tell them they're naughty
app.get("/forbidden", function (req, res, next) {
  res.render("forbidden");
  res.end();
});

// get request for login page
app.get("/success", function (req, res, next) {
  // check if the user profile has been populated
  if(userProfile){
    // check if the email for the user's profile is authorized
    if(userProfile.emails[0].value == "howardpearce0@gmail.com") {
      console.log("User email " + userProfile.emails[0].value + " successfully authenticated.");
      res.redirect("/admin");
    } else {
      console.log("User email " + userProfile.emails[0].value + " was rejected.");
      res.redirect("/?login=false");
    }
  } else {
    res.redirect("/?login=false");
  }
  res.end();
});

// callback to protect pages
function authenticateUser (req, res, next) {
  // check if we're allowed to be here
  if(!userProfile){
    res.redirect("/forbidden");
  } else {
    if (userProfile.emails[0].value != "howardpearce0@gmail.com") {
      res.redirect("/forbidden");
    } else {
      next();
    }
  }
}


// THE FOLLOWING IS FOR GOOGLE AUTHENTICATION: DO NOT TOUCH OR SO HELP ME
// REFERENCES https://www.loginradius.com/blog/async/google-authentication-with-nodejs-and-passportjs/

/*  PASSPORT SETUP  */

var userProfile;

app.use(passport.initialize());
app.use(passport.session());

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
  passport.authenticate('google', { failureRedirect: '/?login=false' }),
  function(req, res) {
    res.redirect('/success');
  });
