/**

File: server.js
Author: Howard Pearce
Last Edit: Febuary 13, 2021
Description: Main route and logic handler for node application. Everything that
             happens on the website starts here.

**/

// dependencies
const express        = require("express");
const router         = express.Router();
const passport       = require("passport");
const session        = require("express-session");
const mongoose       = require("mongoose");
const crypto         = require("crypto");
const fs             = require("fs");
const sanitize       = require('mongo-sanitize');
const bodyParser     = require('body-parser');
const path           = require('path');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { exec }       = require("child_process");

// Written libraries
const access_code    = require("./lib/access_code.js");
const initializer    = require("./lib/initializer.js");
var Authenticator    = require("./lib/authenticator.js");
var Database         = require("./lib/database.js");

// ------------------------------------------------------------------------------------------------------------------------------------------
// INITIALIZE EVERYTHING WE NEED FOR THE APP TO START ---------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------

// initialize multerSetup
var multerDependences = initializer.initMulter();
var multer = multerDependences[0];
var storage = multerDependences[1];

// initialize app
var app = initializer.initApp();

// create authenticator object
database      = new Database('mongodb://127.0.0.1/my_database');
authenticator = new Authenticator(database);

// generate the users access code if it doesn't exist
access_code.generateAccessCode();

// --------------------------------------------------------------------------------------------------------------------------------------------
// END OF INITIALIZATION ----------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------


// --------------------------------------------------------------------------------------------------------------------------------------------
// THIS SECTION HANDLES ROUTING ---------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------

// get request for root page
app.get('/', function (req, res, next) {
  var login_status = req.query.login;
  res.render('index', {loggedin: req.session.login, login: login_status});
  res.end()
});

app.get('/resume', function (req, res, next) {
  res.render("resume", {loggedin: req.session.login});
});

// THIS SECTION IS FOR HANDLING THE GENERATION AND VIEWING OF POSTS
app.get("/posts/add", authenticateUser, function (req, res, next) {
  res.render("posts/addpost", {loggedin: req.session.login});
  res.end()
});

// upload a new post to database
app.post("/posts/upload-post", authenticateUser, function (req, res, next) {

  // get the uploaded file from the post request
  let upload = multer({ storage: storage }).single('code');

  // TODO: improve upload security for file
  upload(req, res, function(err) {

    if (!req.file) {
      var postSnippet = undefined;
    } else {
      // does not need to be escaped since we generate the name here
      var postSnippet = req.file.path;
    }

    // sanitize the inputs
    var newTitle = sanitize(escape(req.body.title));
    var newText = sanitize(escape(req.body.content));
    var postType = sanitize(escape(req.body.type));

    // create new db object using data
    database.create_post({ title: newTitle, type: postType, snippet: postSnippet, content: newText }).then( result => {
      res.redirect("/admin");
      res.end();
    }).catch (err => {
      res.redirect("posts/posterror");
    });
  });
});

// delete a post
app.post("/posts/delete_post", authenticateUser, function (req, res, next) {
  var id = sanitize(escape(req.body.id));

  // get database to delete post
  database.delete_post(id).then( result => {
    // send back to admin page with result in a query string
    res.redirect("/admin?delete=true");
    res.end();
  }).catch( err => {
    // TODO: send to proper error location, this says error loading post.
    database.post_fail(res);
  });
});

// take user to page to edit post
app.post("/posts/edit_post", authenticateUser, function (req, res, next) {

  // extract the ID of the post from the post request
  var id = sanitize(escape(req.body.id));

  // get the post using its ID
  database.find_post(id).then( post => {
      // decode special characters
      post.title = unescape(post.title);
      post.content = unescape(post.content);
      post.type = unescape(post.type);

      // give user a page to edit the content
      res.render("posts/editpost", {loggedin: req.session.login, postData: post})
  }).catch( err => {
      database.post_fail(res);
  });
});

// upload edited post to databse
app.post("/posts/upload-post-edit", authenticateUser, function (req, res, next) {

  // get the uploaded file from the post request
  let upload = multer({ storage: storage }).single('code');

  // TODO: improve upload security for file
  upload(req, res, function(err) {

    // get ID from the post request
    var id = sanitize(escape(req.body.id));
    var title = sanitize(escape(req.body.title));
    var content = sanitize(escape(req.body.content));
    var type = sanitize(escape(req.body.type));

    // check if new post edit has a file
    if (!req.file) {
      var postSnippet = undefined;
    } else {
      // does not need to be escaped since we generate the name here
      var postSnippet = req.file.path;
      // we have the new file, delete the old one
      if(req.body.editSnippet != undefined) {
        // get the post using its ID
        database.find_post(id).then( post => {
          console.log("INFO: Editing snippet for post, deleting old one.");
          fs.unlinkSync(post.snippet);
        }).catch( err => {
            database.post_fail(res);
        });
      }
    }

    // decide whether or not to include snippet in update
    if (postSnippet == undefined) {
      var update = {title: title, type: type, content: content };
    } else {
      var update = {title: title, type: type, content: content, snippet: postSnippet };
    }

    // update the post using the update data and the post's ID
    database.edit_post( id, update ).then( post => {
      // take user back to admin page with result
      res.redirect("/admin?edit=true");
    }).catch(err => {
      res.redirect("posts/posterror");
    });
  });
});

// view all posts that have been created
app.get("/posts/view_posts", function (req,res,next) {
  // extract the query string for post postType
  postType = req.query.type;

  // if the query string was empty, search for all posts
  if (postType == undefined || postType == "") {
    query = {}
  } else {
    query = {type:postType}
  }

  // query mongodb for all posts
  database.find_posts(query).then( posts => {
    // decode special characters in lists of posts
    posts.forEach(function(post, index, arr) {
      post.title = unescape(post.title);
      post.content = unescape(post.content);
    });
    // send user to view posts page along with data for every post
    res.render("posts/viewposts", {loggedin: req.session.login, postdata: posts, type: postType});
    // end request
    res.end();
  }).catch( err => {
      database.post_fail(res);
  });
});

// view individual post
app.get("/posts/view_post", function (req,res,next) {
  var id = sanitize(escape(req.query.id));

  database.find_post(id).then( post =>  {
    // prepare the post to be sent (unescape input)
    post.title = unescape(post.title);
    post.content = unescape(post.content);
    content =  post.content.split("\n");

    // debug
    console.log("DEBUG: loading post");
    console.log("DEBUG: Title: \n" + post.title);
    console.log("DEBUG: Content: \n" + post.content);

    // check if this post has a code snippet -- This should be moved somewhere else
    if (post.snippet != undefined) {
      console.log("DEBUG: Post has a code snippet");
      snippetPath = path.dirname(require.main.filename) + "\\" + post.snippet.replace("\\","/");
      // check if the file exists
      if (fs.existsSync(snippetPath)) {

        if (req.query.args != undefined) {
          // sanitize input
          var args = sanitize(escape(req.query.args));
        } else {
          var args = "";
        }

        console.log("DEBUG: executing cmd: 'python " + post.snippet + " " + args + "'");

        // execute the snippet
        exec("python " + post.snippet + " " + args, (error, stdout, stderr) => {
          // check for errors
          if (error) {
            console.error(`ERROR: code failed to execute: ${error.message}`);
          }

          // debug
          console.log("DEBUG: Code executed with output: '" + stdout + "'");

          // preprocess the output
          var output = unescape(stdout).split("\n")

          // send user to view post page with data about the post
          res.render("posts/viewpost", {loggedin: req.session.login, postdata: post, content: content, code: output });
          // end request
          res.end();
        });
      } else {
        console.error("ERROR: Couldn't find uploaded code snippet at: '" + snippetPath + "'");
      }
    } else {
      // send user to view post page with data about the post
      res.render("posts/viewpost", {loggedin: req.session.login, postdata: post, content: content});
      // end request
      res.end();
    }
  }).catch( err => {
      database.post_fail(res);
  });
});

// THIS SECTION ALL RELATES TO HANDLING REQUESTS FOR LOGGING IN / CONFIRMING IDENTITY
// get request to logout
app.get('/logout', function (req, res, next) {
  req.session.email = null;
  req.session.login = false;
  res.redirect('/');
});

// get request for login page
app.get("/admin", authenticateUser, function (req, res, next){
  // load any query strings
  var edit_status = req.query.edit;
  var delete_status = req.query.delete;

  database.find_posts({}).then( posts => {
    // decode special characters in lists of posts
    posts.forEach(function(post, index, arr) {
      post.title = unescape(post.title);
      post.type = unescape(post.type);
      post.content = unescape(post.title);
    });
    // parsed_posts = JSON.stringify(posts, null, 2);
    res.render('admin.pug', {loggedin: req.session.login, postdata: posts, del: delete_status, edit: edit_status});
    res.end();
  })
});

// send people here to tell them they're naughty
app.get("/forbidden", function (req, res, next) {
  res.status(403).render("forbidden", {loggedin: req.session.login});
  res.end();
});

// callback to protect pages
function authenticateUser (req, res, next) {
  // check if we're allowed to be here
  if(!req.session.login){
    res.redirect("/forbidden");
  } else {
    if (req.session.email != authenticator.admin) {
     res.redirect("/forbidden");
    } else {
      next();
    }
  }
}

// --------------------------------------------------------------------------------------------------------------------------------------------
// END OF ROUTING -----------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------


// --------------------------------------------------------------------------------------------------------------------------------------------
// THE FOLLOWING IS FOR GOOGLE AUTHENTICATION -------------------------------------------------------------------------------------------------
// REFERENCES https://www.loginradius.com/blog/async/google-authentication-with-nodejs-and-passportjs/ ----------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------

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
      // place result in userProfile
      userProfile=profile;
      // return result
      return done(null, userProfile);
  }
)

// pass google api to passport
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
  var code = sanitize(escape(req.body.code));
  code = crypto.createHash('sha256').update(code).digest('hex');

  // get the code stored locally
  fs.readFile('access.txt', 'utf8', function (err, data) {
    // handle errors
    if (err) return console.log(err);
    // compare the submitted code to the stored one
    if (code == data) {
      console.log("Submitted code matches stored example. Next submitted email will become administrator account.");
      authenticator.isAccessCodeValid = true;
      res.redirect("/auth/google");
    } else {
      res.redirect("/auth/newadmin?access=false");
    }
  });
});

// send authentication request to google
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// TODO: Move this to authenticator
// receive the final response from google after logging in
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/?login=false' }), function(req, res) {
  // redirect to verify the result
  // check if the user profile has been populated
  req.session.email = userProfile.emails[0].value;

  // check if the submitted email should be made an administrator
  if ( authenticator.isAccessCodeValid ) {
    console.log("Adding email " + req.session.email + " as the administrator account.");
    // set the administrator email to this one since it wasn't done properly
    authenticator.admin = req.session.email;
    // turn off the newEmail flag to rerturn to base case
    authenticator.doAddAdmin = false;

    // create new database obj
    var newAdmin = new database.admin_model({ email:req.session.email });

    // upload to database
    newAdmin.save(function (err, admin) {
      // intercept and log errors
      if (err) return console.error(err);
      // log result to console
      console.log("INFO: admin account " + admin.email + " successfully uploaded.");
      // turn off flag to ensure we don't add more administrators by accident.
      authenticator.isAccessCodeValid = false;
    });
  }

  // check if the email for the user's profile is authorized
  if(req.session.email == authenticator.admin) {
    req.session.login = true;
    console.log("INFO: User email '" + req.session.email + "' successfully authenticated.");
    res.redirect("/admin");
  } else {
    req.session.login = false;
    console.log("INFO: User email '" + req.session.email + "' was rejected.");
    console.log("DEBUG: Did not match administrator account '" + authenticator.admin + "'")
    res.redirect("/?login=false");
  }
});

app.get('*', function(req, res){
  res.status(404).send('does not exist.');
});
