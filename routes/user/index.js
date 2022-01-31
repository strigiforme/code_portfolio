/**

File: index.js
Author: Howard Pearce
Last Edit: May 2, 2021
Description: Handles all logic for users

**/

var express          = require("express");
var database         = require("database");
var objects          = require("objects");
var middleware       = require("middleware");
var logger           = require("logger");
const fs             = require("fs");
var { exec }         = require("child_process");
var document_package = require("document");
var Document         = document_package.Document;
var Sanitizer        = middleware.sanitizer;
var Post             = objects.Post;

var app = module.exports = express();

// get request for root page
app.get('/' ,function (req, res, next) {
  var login_status = req.query.login;
  res.render('index', {loggedin: req.session.login, login: login_status});
  res.end()
});

app.get('/document_test', function (req, res, next) {
  var document_id = req.query.doc;
  var document_view = database.findDocumentById(document_id).then( doc => {
    var clean_doc = new Document(doc);
    logger.debug("Document: " + clean_doc.toString());
    logger.debug("Rendered HTML: " + clean_doc.render());
    res.render("document", { doc : clean_doc });
    res.end();
  });
});

app.get('/resume', function (req, res, next) {
  res.render("resume", {loggedin: req.session.login});
});

// view all posts that have been created
app.get("/posts/view_posts", function (req, res, next) {
  var all_posts = new Array();
  // extract the query string for post postType
  postType = req.query.type;
  // if the query string was empty, search for all posts
  if ( postType == undefined || postType == "" ) {
    query = {};
  } else {
    query = { type:postType };
  }
  // query mongodb for all posts
  database.queryForPosts(query).then( posts => {
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
      logger.error(err);
      next(err);
  });
});

// view individual post
app.get("/posts/view_post", function (req,res,next) {
  var id = Sanitizer.clean(req.query.id);
  database.findPostById(id).then( post =>  {
    var to_view = new Post(post);
    // check if this post has a code snippet -- This should be moved somewhere else
    if (to_view.has_snippet) {
      logger.debug("Loaded post has a code snippet");
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
        logger.info(`Executing cmd: 'python ${post.snippet} ${args}`);
        // execute the snippet
        exec("python " + to_view.snippet + " " + args, (error, stdout, stderr) => {
          // check for errors
          if (error) { logger.error(`Code failed to execute: ${error.message}`); }
          // debug the output
          logger.debug(`Code executed with output: '${stdout}'`);
          // preprocess the output
          var output = unescape(stdout).split("\n")
          // send user to view post page with data about the post
          res.render("posts/viewpost", {loggedin: req.session.login, postdata: to_view.export_to_view(), code: output });
          // end request
          res.end();
        });
      } else {
        logger.error("Couldn't find uploaded code snippet at: '" + snippetPath + "'");
      }
    } else {
      logger.info("Viewing normal post:");
      // send user to view post page with data about the post
      res.render("posts/viewpost", {loggedin: req.session.login, postdata: to_view.export_to_view()});
      // end request
      res.end();
    }
  }).catch( err => {
    logger.error(err);
    next(err);
  });
});
