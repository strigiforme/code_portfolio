/**

File: index.js
Author: Howard Pearce
Last Edit: May 17, 2021
Description: Handles all logic for the administration of the portfolio

**/

var express       = require("express");
const fs          = require("fs");
var { exec }      = require("child_process");
const path        = require('path');
var database      = require("database");
var objects       = require("objects");
var logger        = require("logger");
var snippets      = require("file_upload");
var record        = require("ip_logger");
var authenticator = require("authenticator");
var middleware    = require("middleware");
var Sanitizer     = middleware.sanitizer;
var authenticate  = middleware.verify;

const upload = snippets.multer;
var Post          = objects.Post;
var Visitor       = objects.Visitor;
var Location      = objects.Location;

var app = module.exports = express();

app.get("/search_posts", authenticate, function(req, res, next) {
  var params = Sanitizer.clean(req.query.search);
  if (params != undefined) {
    // search for any title that contains the substring provided by the user
    var regex = new RegExp(params, 'i');
    var search_args = { title: {$regex: regex} };
    database.find_posts(search_args).then(posts => {
      // logic for presenting search results is in ajax.js
      res.send( { posts: posts } );
      res.end();
    }).catch( error => {
      logger.log_error(`Error occurred while searching for posts.
                        Unable to return search request: ${error}`);
      res.end();
    });
  }
});

app.get("/posts/uploaderror", function (req, res, next) {
  res.render("posts/uploaderror", {loggedin: req.session.login});
  res.end();
});

app.get("/posts/add", authenticate, function (req, res, next) {
  res.render("posts/addpost", {loggedin: req.session.login});
  res.end()
});



// upload a new post to database
app.post("/posts/upload-post", upload.single("code"), function (req, res, next) {
  console.log(req.body);
  console.log(req.file);
  // get the uploaded file from the post request
  // let upload = fileManager.get_code_upload();
  // TODO: improve upload security for file
  //upload(req, res, function(err) {
    if ( req.fileValidationError ) {
      logger.log_warning("Rejecting file upload: " + req.fileValidationError);
      return res.redirect("uploaderror");
    }
    // else if (err) {
    //   logger.log_warning("Rejecting file upload: " + err);
    //   return res.redirect("uploaderror");
    // }
    // construct args for post object
    var post_args = {id:"", title:req.body.title, content:req.body.content, type:req.body.type, snippet: undefined}
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
  //});
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
app.post("/posts/upload-post-edit", authenticate, upload.single("code"), function (req, res, next) {
  // get the uploaded file from the post request
  //let upload = fileManager.get_code_upload();
  //console.log(req.body);
  //console.log(req);
  // load the request into arguments to construct a post
  var post_args = {id:req.body.id, title:req.body.title, content:req.body.content, type:req.body.type, snippet: undefined}
  //upload(req, res, function(err) {
    if ( req.fileValidationError ) {
      logger.log_warning("Rejecting file upload: " + req.fileValidationError);
      return res.redirect("uploaderror");
    } else if (err) {
      logger.log_warning("Rejecting file upload: " + err);
      return res.redirect("uploaderror");
    }
    // check if new post edit has a file
    if (req.file) {
      logger.log_info("New code snippet submitted.")
      // does not need to be escaped since we generate the name within the portfolio
      post_args.snippet = req.file.path;
      // we have the new file, delete the old one
      if(req.body.editSnippet != undefined) {
        // get the post using its ID
        database.find_post(req.body.id).then( post => {
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
  //});
});

// THIS SECTION ALL RELATES TO HANDLING REQUESTS FOR LOGGING IN / CONFIRMING IDENTITY
// get request to logout
app.get('/logout', function (req, res, next) {
  req.session.email = null;
  req.session.login = false;
  res.redirect('/');
});

// get request for login page
app.get("/admin", record, authenticate, function (req, res, next){
  // iterate over all the posts in the database
  database.find_posts({}).then( posts => {
    var all_posts = new Array();
    // TODO: Move this to the post class?
    // decode special characters in lists of posts
    posts.forEach(function(post, index, arr) {
      post_args = { id: post.id, title: post.title, content: post.content, type: post.type };
      var temp_post = new Post(post_args);
      all_posts.push(temp_post.export_to_view());
    });
    // get the visitor information as well and pass it to pug page
    database.find_visitors({}).then( visitors => {
      var all_visitors = new Array();
      visitors.forEach(function(visit, index, arr) {
        visitor_args = { id: visit._id, last_visit: visit.last_visit, first_visit: visit.first_visit, location_string: visit.location_string, ip: visit.ip, visits: visit.visits };
        var temp_visitor = new Visitor(visitor_args);
        temp_visitor.location.clean();
        all_visitors.push(temp_visitor.export_to_pug());
      });
      res.render('admin.pug', { visitors: all_visitors,
                                loggedin: req.session.login,
                                postdata: all_posts,
                                del: req.query.edit,
                                edit: req.query.delete});
      res.end();
    });
  });
});
