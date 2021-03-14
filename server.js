/**

File: server.js
Author: Howard Pearce
Last Edit: March 13, 2021
Description: Main route and logic handler for node application. Everything that
             happens on the website starts here.

**/

// dependencies
const express        = require("express")
const passport       = require("passport")
const session        = require("express-session")
const mongoose       = require("mongoose")
const crypto         = require("crypto")
const fs             = require("fs")
const path           = require('path')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const { exec }       = require("child_process")

// Written libraries
const access_code      = require("./lib/access_code.js")
const Initializer      = require("./lib/initializer.js")
const Sanitizer        = require("./lib/sanitizer.js")
const Authenticator    = require("./lib/authenticator.js")
const Database         = require("./lib/database.js")
const Post             = require("./lib/post.js")
var   logger           = require("./lib/logger.js")

// initialize multer setup
var multerDependences = Initializer.initMulter();
var multer = multerDependences[0];
var storage = multerDependences[1];

// initialize app
var app = Initializer.initApp();

// create authenticator object
database      = new Database('mongodb://127.0.0.1/my_database');
authenticator = new Authenticator.Authenticator(database);
authenticate  = Authenticator.AuthenticatorCallback;

// generate the users access code if it doesn't exist
access_code.generateAccessCode();

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
app.get("/posts/add", authenticate, function (req, res, next) {
  res.render("posts/addpost", {loggedin: req.session.login});
  res.end()
});

// upload a new post to database
app.post("/posts/upload-post", authenticate, function (req, res, next) {
  // get the uploaded file from the post request
  let upload = multer({ storage: storage }).single('code');
  // TODO: improve upload security for file
  upload(req, res, function(err) {
    // construct args for post object
    var post_args = {id:"", title:req.body.title, content:req.body.content, type:req.body.type, snippet: undefined}
    // TODO: expand file check to differentiate between images and code snippets
    // check if a file was submitted with this post (a code snippet)
    if (req.file) { post_args.snippet = req.file.path; }
    // create a post object from the extracted args
    var new_post = new Post(post_args);
    // create new db object using data
    database.create_post(new_post.export_to_db()).then( result => {
      res.redirect("/admin");
      res.end();
    }).catch (err => {
      res.redirect("posts/posterror");
    });
  });
});

// delete a post
app.post("/posts/delete_post", authenticate, function (req, res, next) {
  var id = Sanitizer.clean(req.body.id);

  // get database to delete post
  database.delete_post(id).then( result => {
    // send back to admin page with result in a query string
    res.redirect("/admin?delete=true");
    res.end();
  }).catch( err => {
    // TODO: send to proper error location, this says error loading post.
    database.post_fail(res, err);
  });
});

// take user to page to edit post
app.post("/posts/edit_post", authenticate, function (req, res, next) {
  // extract the ID of the post from the post request
  var id = Sanitizer.clean(req.body.id);
  // get the post using its ID
  database.find_post(id).then( post => {
      // load the found post
      var to_edit = new Post(post);
      // give user a page to edit the content
      res.render("posts/editpost", {loggedin: req.session.login, postData: to_edit.export_to_view()})
  }).catch( err => {
      database.post_fail(res, err);
  });
});

// upload edited post to databse
app.post("/posts/upload-post-edit", authenticate, function (req, res, next) {
  // get the uploaded file from the post request
  let upload = multer({ storage: storage }).single('code');
  // TODO: improve upload security for file
  upload(req, res, function(err) {
    var post_args = {id:req.body.id, title:req.body.title, content:req.body.content, type:req.body.type, snippet: undefined}
    // check if new post edit has a file
    if (req.file) {
      // does not need to be escaped since we generate the name here
      post_args.snippet = req.file.path;
      // we have the new file, delete the old one
      if(req.body.editSnippet != undefined) {
        // get the post using its ID
        database.find_post(id).then( post => {
          logger.log_info("Editing snippet for post, deleting old one.");
          fs.unlinkSync(post.snippet);
        }).catch( err => {
            database.post_fail(res, err);
        });
      }
    }
    // place the arguments into a post obj
    var to_edit = new Post(post_args);
    // update the post using the post obj and it's ID
    database.edit_post( to_edit.id, to_edit.export_to_db() ).then( post => {
      res.redirect("/admin?edit=true");
    }).catch(err => {
      res.redirect("posts/posterror");
    });
  });
});

// view all posts that have been created
app.get("/posts/view_posts", function (req,res,next) {
  var all_posts = new Array();
  // extract the query string for post postType
  postType = req.query.type;
  // if the query string was empty, search for all posts
  if ( postType == undefined || postType == "" ) {
    query = {}
  } else {
    query = { type:postType };
  }
  // query mongodb for all posts
  database.find_posts(query).then( posts => {
    // decode special characters in lists of posts
    posts.forEach(function(post, index, arr) {
      post_args = { id: post.id, title: post.title, content: post.content, type: post.type};
      var temp_post = new Post(post_args);
      all_posts.push(temp_post.export_to_view());
    });
    // send user to view posts page along with data for every post
    res.render("posts/viewposts", {loggedin: req.session.login, postdata: all_posts, type: postType});
    // end request
    res.end();
  }).catch( err => {
      database.post_fail(res);
  });
});

// view individual post
app.get("/posts/view_post", function (req,res,next) {
  var id = Sanitizer.clean(req.query.id);
  database.find_post(id).then( post =>  {
    var to_view = new Post(post);
    // check if this post has a code snippet -- This should be moved somewhere else
    if (to_view.has_snippet) {
      logger.log_debug("Loaded post has a code snippet");
      // extract the snippet path of the post
      snippetPath = to_view.post_snippet_path;
      // check if the file exists
      if (fs.existsSync(snippetPath)) {
        // check for snippet arguments
        if (req.query.args != undefined) {
          // sanitize input
          var args = Sanitizer.clean(req.query.args);
        } else {
          var args = "";
        }
        logger.log_info(`Executing cmd: 'python ${post.snippet} ${args}`);
        // execute the snippet
        exec("python " + to_view.snippet + " " + args, (error, stdout, stderr) => {
          // check for errors
          if (error) { logger.log_error(`Code failed to execute: ${error.message}`); }
          // debug the output
          logger.log_debug(`Code executed with output: '${stdout}'`);
          // preprocess the output
          var output = unescape(stdout).split("\n")
          // send user to view post page with data about the post
          res.render("posts/viewpost", {loggedin: req.session.login, postdata: to_view.export_to_view(), code: output });
          // end request
          res.end();
        });
      } else {
        logger.log_error("Couldn't find uploaded code snippet at: '" + snippetPath + "'");
      }
    } else {
      logger.log_info("Viewing normal post:");
      // send user to view post page with data about the post
      res.render("posts/viewpost", {loggedin: req.session.login, postdata: to_view.export_to_view()});
      // end request
      res.end();
    }
  }).catch( err => {
      database.post_fail(res, err);
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
app.get("/admin", authenticate, function (req, res, next){
  // load any query strings
  var edit_status = req.query.edit;
  var delete_status = req.query.delete;
  // iterate over all the posts in the database
  database.find_posts({}).then( posts => {
    var all_posts = new Array();
    // decode special characters in lists of posts
    posts.forEach(function(post, index, arr) {
      post_args = { id: post.id, title: post.title, content: post.content, type: post.type };
      var temp_post = new Post(post_args);
      all_posts.push(temp_post.export_to_view());
    });
    // parsed_posts = JSON.stringify(posts, null, 2);
    res.render('admin.pug', {loggedin: req.session.login, postdata: all_posts, del: delete_status, edit: edit_status});
    res.end();
  })
});

// send people here to tell them they're naughty
app.get("/forbidden", function (req, res, next) {
  res.status(403).render("forbidden", {loggedin: req.session.login});
  res.end();
});

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
  var code = Sanitizer.clean(req.body.code);
  code = crypto.createHash('sha256').update(code).digest('hex');

  // get the code stored locally
  fs.readFile('access.txt', 'utf8', function (err, data) {
    // handle errors
    if (err) return console.log(err);
    // compare the submitted code to the stored one
    if (code == data) {
      logger.log_info("Submitted code matches stored example. Next submitted email will become administrator account.");
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
    logger.log_info("Adding email " + req.session.email + " as the administrator account.");
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
      logger.log_info("Admin account " + admin.email + " successfully uploaded.");
      // turn off flag to ensure we don't add more administrators by accident.
      authenticator.isAccessCodeValid = false;
    });
  }

  // check if the email for the user's profile is authorized
  if(req.session.email == authenticator.admin) {
    req.session.login = true;
    logger.log_info("User email '" + req.session.email + "' successfully authenticated.");
    res.redirect("/admin");
  } else {
    req.session.login = false;
    logger.log_info("User email '" + req.session.email + "' was rejected.");
    logger.log_debug("Did not match administrator account '" + authenticator.admin + "'")
    res.redirect("/?login=false");
  }
});

app.get('*', function(req, res){
  res.status(404).send('does not exist.');
});
