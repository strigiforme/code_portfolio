// dependencies
var express = require("express");
var router = express.Router();
var passport = require("passport");
var session = require("express-session");
var mongoose = require("mongoose")
var crypto = require("crypto")
var fs = require("fs")

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// state variables
var newEmail = false;
var addAdministrator = false;

// DATABASE PORTION ------------------------------------------------------------------------------------------------------------
// connect to local db instance
mongoose.connect('mongodb://127.0.0.1/my_database', {useNewUrlParser: true, useUnifiedTopology: true});

// get the database obj from the connection
var mongodb = mongoose.connection;

// display connection errors
mongodb.on('error', console.error.bind(console, 'MongoDB connection error:'));

// set up the schema and objects for the database
const postSchema = mongoose.Schema ({ title: String, content: String });
const adminSchema = mongoose.Schema ({ email: String });

// set up models for objects we are using
const Post = mongoose.model('Post', postSchema);
const Admin = mongoose.model('Admin', adminSchema);

// deprecated
mongoose.set('useFindAndModify', false);

var adminAccount;

// END DATABASE PORTION --------------------------------------------------------------------------------------------------------

// APP INIT PORTION ------------------------------------------------------------------------------------------------------------
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

// get the administrator account's email
Admin.find({}, function(err, admins) {

  if (admins.length > 0) {
    adminAccount = admins[0].email
  } else {
    console.log("Unable to find an administrator account. In new Email mode.");
    newEmail = true;
    console.log(newEmail);
  }
})

// END APP INIT PORTION ---------------------------------------------------------------------------------------------------------


// ACCESS CODE PORTION ----------------------------------------------------------------------------------------------------------
// check if the access file doesn't exist
if (!fs.existsSync("access.txt")) {
  // log the creation of the file
  console.log("Access code file does not exist yet, creating now.")

  // access code
  var code = 'sleipnir'

  // get the hashed access code
  var hash = crypto.createHash('sha256').update(code).digest('hex');

  // create the access file
  fs.open("access.txt", "w", function (err) {
    if (err) return console.log(err);
  });

  // write the hash to the access file
  fs.writeFile("access.txt", hash, function (err) {
    if (err) return console.log(err);
  });
} else {
  // Log that we're skipping file generations
  console.log("Access code already exists, skipping generation.");
}
// END ACCESS CODE PORTION -----------------------------------------------------------------------------------------------------


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

// upload a new post to database
app.post("/posts/upload-post", authenticateUser, function (req, res, next) {

  // extract the title and content, will be validated during M4
  var newTitle = req.body.title;
  var newText = req.body.content;

  // create new db object using data
  var newPost = new Post({ title: newTitle, content: newText });

  // save this object to the database
  newPost.save(function (err, post) {
      // intercept and log errors
      if (err) return console.error(err);
      // log result to console
      console.log(post._id + " uploaded.");
    });

  // take user back to admin page to see result
  res.redirect("/admin");
  res.end();
});

// delete a post
app.post("/posts/delete_post", authenticateUser, function (req, res, next) {

  // extract the ID of the post from the post request
  var id = req.body.id;

  // send a query to delete the post corresponding to this ID
  Post.deleteOne({_id: id}, function(err, obj) {
    // catch errors
    if (err) throw err;
    // report result
    console.log("Deleted post with id: " + id)
  });

  // send back to admin page with result in a query string
  res.redirect("/admin?delete=true");
  res.end();
});

// take user to page to edit post
app.post("/posts/edit_post", authenticateUser, function (req, res, next) {

  // extract the ID of the post from the post request
  var id = req.body.id;

  // get the post using its ID
  Post.findOne({_id: id}, function(err, post) {
      // catch errors
      if (err) throw err;
      // give user a page to edit the content
      res.render("posts/editpost", {postData: post})
  });

});

// upload edited post to databse
app.post("/posts/upload-post-edit", authenticateUser, function (req, res, next) {

  // get ID from the post request
  var id = req.body.id;

  // construct obj with update data
  var update = {title: req.body.title, content: req.body.content };

  // update the post using the update data and the post's ID
  Post.findOneAndUpdate( { _id: id }, update, function(err, post) {
    // catch errors
    if (err) throw err;
    // take user back to admin page with result
    res.redirect("/admin?edit=true");
  });

});

// view all posts that have been created
app.get("/posts/view_posts", function (req,res,next) {
  // query mongodb for all posts
  Post.find({}, function(err, posts) {
    // send user to view posts page along with data for every post
    res.render("posts/viewposts", { postdata: posts });
    // end request
    res.end();
  })
});

// view individual post
app.get("/posts/view_post", function (req,res,next) {
  // TODO: validate get string to prevent injection
  // query database for the post that corresponds to this ID
  Post.findOne({ _id: req.query.id }, function(err, post) {
    // send user to view post page with data about the post
    res.render("posts/viewpost", { postdata: post });
    // end request
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

// callback to protect pages
function authenticateUser (req, res, next) {
  // check if we're allowed to be here
  if(!req.session.login){
    res.redirect("/forbidden");
  } else {
    if (req.session.email != adminAccount) {
     res.redirect("/forbidden");
    } else {
      next();
    }
  }
}


// THE FOLLOWING IS FOR GOOGLE AUTHENTICATION
// REFERENCES https://www.loginradius.com/blog/async/google-authentication-with-nodejs-and-passportjs/

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
var strategy = new GoogleStrategy({ clientID: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET, callbackURL: "http://localhost:3000/auth/google/callback" }, function(accessToken, refreshToken, profile, done) {
      // place result in userProfile
      userProfile=profile;
      // return result
      return done(null, userProfile);
  }
)

// pass google api to passport
passport.use(strategy);

app.get('/auth', function (req, res, next) {

  if (newEmail) {
    res.redirect('/auth/newadmin');
  } else {
    res.redirect('/auth/google');
  }



});

app.get('/auth/newadmin', function (req, res, next) {
  res.render('newadmin.pug');
  res.end();
});

app.post('/auth/newadmin', function (req, res, next) {
  // extract the code submitted by the user
  var code = req.body.code;
  code = crypto.createHash('sha256').update(code).digest('hex');

  // get the code stored locally
  fs.readFile('access.txt', 'utf8', function (err, data) {
    // handle errors
    if (err) return console.log(err);
    // compare the submitted code to the stored one
    if (code == data) {
      console.log("Submitted code matches stored example. Next submitted email will become administrator account.");
      addAdministrator = true;
      res.redirect("/auth/google");
    }
  });
});

// send authentication request to google
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// receive the final response from google after logging in
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/?login=false' }), function(req, res) {
  // redirect to verify the result
  // check if the user profile has been populated
  if(userProfile) {
    req.session.login = true;
    req.session.email = userProfile.emails[0].value;

    // check if the submitted email should be made an administrator
    if ( addAdministrator ) {
      console.log("Adding email " + req.session.email + " as the administrator account.");
      // set the administrator email to this one since it wasn't done properly
      adminAccount = req.session.email;
      
      // create new databse obj
      var newAdmin = new Admin({ email:req.session.email });

      // upload to databse
      newAdmin.save(function (err, admin) {
        // intercept and log errors
        if (err) return console.error(err);
        // log result to console
        console.log(admin._id + " successfully uploaded.");
        // turn off flag to ensure we don't add more administrators by accident.
        addAdministrator = false;

      });
    }

    // check if the email for the user's profile is authorized
    if(req.session.email == adminAccount) {
      console.log("User email " + req.session.email + " successfully authenticated.");
      res.redirect("/admin");
    } else {
      console.log("User email " + req.session.email + " was rejected.");
      res.redirect("/?login=false");
    }
  } else {
    res.redirect("/?login=false");
  }
});
