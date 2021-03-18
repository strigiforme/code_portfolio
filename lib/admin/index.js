/**

File: index.js
Author: Howard Pearce
Last Edit: March 18, 2021
Description: Handles all logic for the administration of the portfolio

**/

var express       = require("express");
const fs          = require("fs");
var { exec }      = require("child_process");
const path        = require('path');
var database      = require("../core/database.js");
var Post          = require("../core/post.js");
var Sanitizer     = require("../core/sanitizer.js");
var logger        = require("../core/logger.js");
var authenticate  = require("../core/verify.js");
var authenticator = require("../core/authenticator.js");
var fileManager   = require("../core/fileManager.js");

var app = module.exports = express();

app.get("/posts/add", authenticate, function (req, res, next) {
  res.render("posts/addpost", {loggedin: req.session.login});
  res.end()
});

// upload a new post to database
app.post("/posts/upload-post", authenticate, function (req, res, next) {
  // get the uploaded file from the post request
  let upload = fileManager.get_code_upload();
  // TODO: improve upload security for file
  upload(req, res, function(err) {
    if ( req.fileValidationError ) {
      logger.log_warning("Rejecting file upload: " + req.fileValidationError);
      return res.send(req.fileValidationError);
    } else if (err) {
      logger.log_warning("Rejecting file upload: " + err);
      return res.send(err);
    }
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
  });
});

// delete a post
app.post("/posts/delete_post", authenticate, function (req, res, next) {
  var id = Sanitizer.clean(req.body.id);
  console.log("id:" + id)
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
  let upload = fileManager.get_code_upload();
  // load the request into arguments to construct a post
  var post_args = {id:req.body.id, title:req.body.title, content:req.body.content, type:req.body.type, snippet: undefined}
  upload(req, res, function(err) {
    if ( req.fileValidationError ) {
      logger.log_warning("Rejecting file upload: " + req.fileValidationError);
      return res.send(req.fileValidationError);
    } else if (err) {
      logger.log_warning("Rejecting file upload: " + err);
      return res.send(err);
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
